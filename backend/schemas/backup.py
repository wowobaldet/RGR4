from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BackupBase(BaseModel):
    name: str
    path: str
    created_at: Optional[datetime] = None

class BackupCreate(BackupBase):
    pass

class Backup(BackupBase):
    id: int

    class Config:
        from_attributes = True