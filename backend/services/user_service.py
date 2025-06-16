from models.user import User as DBUser
from schemas.user import UserUpdate, UserCreate, User
from core.auth import pwd_context
from sqlalchemy.orm import Session

def get_user_by_id(db: Session, user_id: int):
    return db.query(DBUser).filter(DBUser.id == user_id).first()

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user_by_id(db, user_id)

    if not db_user:
        return None

    update_data = user_update.dict(exclude_unset=True)  

    for key, value in update_data.items():
        if key == "id":
            continue  # 
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def create_user(db: Session, user: UserCreate):
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