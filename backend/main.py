from fastapi import FastAPI, Request
from core.logger import logger
from routers import users, events, auth
from fastapi.middleware.cors import CORSMiddleware
from routers.backups import router as backups_router


app = FastAPI()

# Подключение роутеров
app.include_router(users.router)
app.include_router(events.router)
app.include_router(auth.router)
app.include_router(backups_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Адрес твоего React-приложения
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.exception(f"Unhandled exception: {e}")
        raise e