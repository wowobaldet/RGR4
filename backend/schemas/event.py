from pydantic import BaseModel
from typing import Optional
from datetime import date, time

from pydantic import BaseModel

class RoleBase(BaseModel):
    name_r: str

class Role(RoleBase):
    id: int

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    name: str
    date: date | str
    time: time | str
    duration: int
    type: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        from_attributes = True