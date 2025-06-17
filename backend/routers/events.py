from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.event_service import get_event_by_id, create_event_in_db, update_event_in_db, delete_event_in_db
from core.auth import get_current_admin_or_worker
from models.user import User as DBUser
from schemas.event import Event, EventCreate
from models.event import Event as DBEvent
from database import get_db
from typing import List

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/", response_model=Event)
def create_event(event: EventCreate, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin_or_worker)):
    return create_event_in_db(db, event=event)

@router.get("/", response_model=List[Event])
def read_event(db: Session = Depends(get_db)):
    events = db.query(DBEvent).all()
    if not events:
        raise HTTPException(status_code=404, detail="Event not found")
    return events

@router.get("/{event_id}", response_model=Event)
def read_event(event_id: int, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin_or_worker)):
    event = db.query(DBEvent).filter(DBEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "id": event.id,
        "name": event.name,
        "date": event.date.isoformat(),       # datetime.date → str
        "time": event.time.strftime("%H:%M"), # datetime.time → str
        "duration": event.duration,
        "type": event.type
    }


@router.put("/{event_id}", response_model=Event)
def edit_event(event_id: int, event: EventCreate, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin_or_worker)):
    updated_event = update_event_in_db(db, event_id=event_id, event=event)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

@router.delete("/{event_id}")
def remove_event(event_id: int, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_admin_or_worker)):
    result = delete_event_in_db(db, event_id=event_id)
    if not result:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted"}