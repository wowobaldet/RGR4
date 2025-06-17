
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Твои модули
from core.auth import authenticate_user, create_access_token
from database import get_db
from schemas.user import User
from models.user import User as DBUser

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    login: str
    password: str

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    # Пытаемся найти и проверить пользователя
    user = authenticate_user(db, request.login, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Генерируем токен
    access_token = create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}