from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.user_service import get_user_by_id, update_user, delete_user
from schemas.user import User, UserUpdate, UserCreate, UserBase
from models.user import User as DBUser
from database import get_db
from core.auth import pwd_context, get_current_admin, get_current_user
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[User])
def read_user(db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin)):
    users = db.query(DBUser).all()
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    return users

@router.get("/{user_id}", response_model=UserBase)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "login":user.login,
        "email":user.email,
        "id_r":user.id_r,
        
    }

@router.put("/{user_id}", response_model=User)
def edit_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    updated_user = update_user(db, user_id=user_id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return updated_user

@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    result = delete_user(db, user_id=user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

@router.post("/register", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(DBUser).filter(DBUser.login == user.login).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Логин уже занят")

    hashed_password = pwd_context.hash(user.password)

    db_user = DBUser(
        login=user.login,
        password=hashed_password,
        email=user.email,
        id_r=user.id_r
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserBase)
async def read_current_user(
    current_user: DBUser = Depends(get_current_user)
):
    return current_user.id_r
