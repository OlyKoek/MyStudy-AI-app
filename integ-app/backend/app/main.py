from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.predict import router as predict_router

app = FastAPI(
    title="CNN Image Classifier API",
    description="FastAPI version of the Flask CNN classifier",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
