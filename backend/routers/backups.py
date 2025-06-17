from fastapi import APIRouter, HTTPException, status, Body, Depends
from fastapi.responses import FileResponse
import os
import subprocess
from datetime import datetime
import glob
from models.user import User as DBUser
import stat
from core.auth import get_current_admin

router = APIRouter(prefix="/backups", tags=["backups"])

BACKUP_DIR = "./backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

# Конфигурация PostgreSQL
PG_CONFIG = {
    "user": "vlad",
    "password": "321",
    "host": "localhost",
    "port": "5433",
    "database": "spaevent"
}

def setup_pgpass():
    """Используем pgpass.conf из папки проекта"""
    pgpass_path = os.path.join(os.path.dirname(__file__), 'pgpass.conf')
    
    # Если файла нет - создаем
    if not os.path.exists(pgpass_path):
        with open(pgpass_path, 'w') as f:
            f.write(f"{PG_CONFIG['host']}:{PG_CONFIG['port']}:*:{PG_CONFIG['user']}:{PG_CONFIG['password']}\n")
        
        # Устанавливаем права только для текущего пользователя (Windows)
        if os.name == 'nt':
            os.system(f'icacls "{pgpass_path}" /inheritance:r /grant:r "%USERNAME%":R')
    
    # Указываем системе использовать этот файл
    os.environ['PGPASSFILE'] = pgpass_path

# Настраиваем при старте
setup_pgpass()

def find_pg_tool(tool_name: str):
    """Поиск пути к утилитам PostgreSQL на Windows"""
    possible_paths = [
        r"C:\Program Files\PostgreSQL\17\bin\{tool_name}.exe",
        tool_name + ".exe"
    ]
    
    for path_pattern in possible_paths:
        matches = glob.glob(path_pattern.format(tool_name=tool_name))
        if matches:
            return matches[0]
    return None

@router.post("", status_code=status.HTTP_201_CREATED)
async def handle_backup_action(
    action: str = Body(...), 
    filename: str = Body(None),
    clean: bool = Body(False),
    current_user: DBUser = Depends(get_current_admin)
):
    if action == "create":
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"backup_{timestamp}.sql"
        filepath = os.path.join(BACKUP_DIR, filename)
        
        pg_dump_path = find_pg_tool("pg_dump")
        if not pg_dump_path:
            raise HTTPException(status_code=500, detail="pg_dump не найден")

        try:
            subprocess.run([
                pg_dump_path,
                "-U", PG_CONFIG["user"],
                "-h", PG_CONFIG["host"],
                "-p", PG_CONFIG["port"],
                "-d", PG_CONFIG["database"],
                "-f", filepath,
                "--clean",
                "--if-exists"
            ], check=True, shell=True)
            return {"status": "success", "filename": filename}
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Ошибка создания бэкапа: {e}")

    elif action == "restore":
        if not filename:
            raise HTTPException(status_code=400, detail="Укажите имя файла")
        
        filepath = os.path.join(BACKUP_DIR, filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Файл не найден")
            
        psql_path = find_pg_tool("psql")
        if not psql_path:
            raise HTTPException(status_code=500, detail="psql не найден")
            
        try:
            if clean:
                subprocess.run([
                    psql_path,
                    "-U", PG_CONFIG["user"],
                    "-h", PG_CONFIG["host"],
                    "-p", PG_CONFIG["port"],
                    "-d", PG_CONFIG["database"],
                    "-c", "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
                ], check=True, shell=True)
            
            subprocess.run([
                psql_path,
                "-U", PG_CONFIG["user"],
                "-h", PG_CONFIG["host"],
                "-p", PG_CONFIG["port"],
                "-d", PG_CONFIG["database"],
                "-f", filepath
            ], check=True, shell=True)
            return {"status": "success"}
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Ошибка восстановления: {e}")

    else:
        raise HTTPException(status_code=400, detail="Неизвестное действие")

@router.get("")
async def list_backups(current_user: DBUser = Depends(get_current_admin)):
    backups = []
    for filepath in glob.glob(os.path.join(BACKUP_DIR, "backup_*.sql")):
        stat = os.stat(filepath)
        backups.append({
            "name": os.path.basename(filepath),
            "size": stat.st_size,
            "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat()
        })
    return sorted(backups, key=lambda x: x["created_at"], reverse=True)

@router.delete("/{filename}")
async def delete_backup(filename: str, current_user: DBUser = Depends(get_current_admin)):
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    try:
        os.remove(filepath)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка удаления: {str(e)}")

@router.get("/{filename}")
async def download_backup(filename: str, current_user: DBUser = Depends(get_current_admin)):
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Файл не найден")
    return FileResponse(filepath, filename=filename)