from fastapi import FastAPI
from app.api import routes
from app.database import Base, engine
import app.models.user_model  # Import user model to ensure table gets created by Base.metadata.create_all

# Create database tables
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CodeGuard Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.on_event("startup")
def startup_event():
    from app.config import settings
    from app.utils.logger import get_logger
    logger = get_logger(__name__)
    
    if not settings.GROQ_API_KEY:
        logger.info("GROQ_API_KEY not set, AI features disabled")

@app.get("/")
def read_root():
    return {"message": "Welcome to CodeGuard Backend API"}
