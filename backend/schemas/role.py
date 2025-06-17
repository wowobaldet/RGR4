from pydantic import BaseModel

class RoleBase(BaseModel):
    name_r: str

class Role(RoleBase):
    id: int

    class Config:
        from_attributes = True