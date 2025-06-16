from sqlalchemy import Column, Integer, String, Date, Time
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(Date)
    time = Column(Time)
    duration = Column(Integer)
    type = Column(String)