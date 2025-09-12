# server/app/routers/progress.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services import progress_service as svc

router = APIRouter(prefix="/api/progress", tags=["progress"])

class SaveChoiceBody(BaseModel):
    userId: str
    missionId: str
    blockId: str
    choiceText: str
    tag: str | None = None

class SaveSummaryBody(BaseModel):
    userId: str
    missionId: str
    summary: str

@router.post("/saveChoice")
def save_choice(body: SaveChoiceBody):
    try:
        svc.save_choice(body.userId, body.missionId, body.blockId, body.choiceText, body.tag)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/saveFinalSummary")
def save_final_summary(body: SaveSummaryBody):
    try:
        completed_at = svc.save_final_summary(body.userId, body.missionId, body.summary)
        return {"success": True, "completed_at": completed_at}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}/traits")
def get_traits(user_id: str):
    return {"success": True, "traits": svc.get_user_traits(user_id)}

@router.get("/{user_id}/missions")
def get_missions(user_id: str):
    return {"success": True, "missions_completed": svc.get_mission_history(user_id)}
