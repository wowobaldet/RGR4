from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    login: str
    email: Optional[str] = None
    id_r: int

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    id_r: Optional[int] = None 

    class Config:
        from_attributes = True    

class User(UserBase):
    id: int

    class Config:
        from_attributes = True


