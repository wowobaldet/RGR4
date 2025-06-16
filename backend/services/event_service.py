from models.event import Event as DBEvent
from sqlalchemy.orm import Session
from schemas.event import Event, EventCreate
def get_event_by_id(db: Session, event_id: int):
    return db.query(DBEvent).filter(DBEvent.id == event_id).first()

def create_event_in_db(db: Session, event: EventCreate):
    db_event = DBEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event_in_db(db: Session, event_id: int, event: EventCreate):
    db_event = get_event_by_id(db, event_id)
    if db_event:
        for key, value in event.dict().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event_in_db(db: Session, event_id: int):
    db_event = get_event_by_id(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False