# backups.py (FastAPI)
from fastapi import APIRouter, HTTPException, status, Body
from fastapi.responses import FileResponse
import os
import subprocess
from datetime import datetime
import glob

router = APIRouter(prefix="/api/backups", tags=["backups"])

BACKUP_DIR = "../backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

# Конфигурация PostgreSQL
PG_CONFIG = {
    "user": "vlad",
    "password": "321",
    "host": "localhost",
    "port": "5433",
    "database": "spaevent"
}

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
    clean: bool = Body(False)
):
    if action == "create":
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"backup_{timestamp}.sql"
        filepath = os.path.join(BACKUP_DIR, filename)
        
        pg_dump_path = find_pg_tool("pg_dump")
        if not pg_dump_path:
            raise HTTPException(
                status_code=500,
                detail="pg_dump не найден. Проверьте установку PostgreSQL"
            )
        
        try:
            subprocess.run([
                pg_dump_path,
                "-U", PG_CONFIG["user"],
                "-h", PG_CONFIG["host"],
                "-p", PG_CONFIG["port"],
                "-d", PG_CONFIG["database"],
                "-f", filepath,
                "--clean",  # Добавляем --clean для создания "чистого" бэкапа
                "--if-exists"
            ], check=True, shell=True)
            return {"status": "success", "filename": filename}
        except subprocess.CalledProcessError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка создания бэкапа. Проверьте подключение к БД: {e}"
            )

    elif action == "restore":
        if not filename:
            raise HTTPException(status_code=400, detail="Укажите имя файла для восстановления")
        
        filepath = os.path.join(BACKUP_DIR, filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Файл бэкапа не найден")
            
        psql_path = find_pg_tool("psql")
        if not psql_path:
            raise HTTPException(status_code=500, detail="psql не найден")
            
        try:
            # Очистка базы перед восстановлением, если clean=True
            if clean:
                subprocess.run([
                    psql_path,
                    "-U", PG_CONFIG["user"],
                    "-h", PG_CONFIG["host"],
                    "-p", PG_CONFIG["port"],
                    "-d", PG_CONFIG["database"],
                    "-c", "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;"
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
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка восстановления. Проверьте целостность бэкапа: {e}"
            )

    else:
        raise HTTPException(status_code=400, detail="Неизвестное действие")

@router.get("")
async def list_backups():
    backups = []
    for filepath in glob.glob(os.path.join(BACKUP_DIR, "backup_*.sql")):
        stat = os.stat(filepath)
        backups.append({
            "name": os.path.basename(filepath),
            "size": f"{stat.st_size/1024:.1f} KB",
            "created_at": datetime.fromtimestamp(stat.st_ctime).strftime("%Y-%m-%d %H:%M:%S")
        })
    return sorted(backups, key=lambda x: x["created_at"], reverse=True)

@router.delete("/{filename}")
async def delete_backup(filename: str):
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    try:
        os.remove(filepath)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка удаления: {str(e)}")

@router.get("/{filename}")
async def download_backup(filename: str):
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Файл не найден")
    return FileResponse(
        filepath,
        filename=filename,
        media_type="application/octet-stream"
    )