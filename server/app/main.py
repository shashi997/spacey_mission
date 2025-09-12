from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .agents.summarizer import summarizer
from .agents.analysis import analysis
from .agents.socratic import socratic
from .agents.feedback import feedback

# from .firebase_init import db  # ensures Firebase Admin is initialized
# from .routers.progress import router as progress_router

app = FastAPI(title="Agentic Workflow API")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(progress_router)

class TheInput(BaseModel):
    message: str
    lesson_content: str
    knowledge_level: str
    current_understanding: str

# Routes
@app.post("/summarizer")
def summarizer_api(data: TheInput):
    result = summarizer(
        data.message,
        data.lesson_content,
        data.knowledge_level,
        data.current_understanding,)
    return {"result": result}

@app.post("/analysis")
def analysis_api(data: TheInput):
    result = analysis(
        data.message,
        data.lesson_content,
        data.knowledge_level,
        data.current_understanding,
    )
    return {"result": result}

@app.post("/socratic")
def socratic_api(data: TheInput):
    result = socratic(
        data.message,
        data.lesson_content,
        data.knowledge_level,
        data.current_understanding,
    )
    return {"result": result}

@app.post("/feedback")
def feedback_api(data: TheInput):
    result = feedback(
        data.message,
        data.lesson_content,
        data.knowledge_level,
        data.current_understanding,
    )
    return {"result": result}
