# server/app/services/progress_service.py
from datetime import datetime
from typing import Dict, List, Optional
from firebase_admin import firestore
from ..firebase_init import db

def _now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"

def save_choice(user_id: str, mission_id: str, block_id: str, choice_text: str, tag: Optional[str]) -> None:
    user_ref = db.collection("users").document(user_id)
    mission_ref = user_ref.collection("missions").document(mission_id)

    choice_item = {"block_id": block_id, "choice": choice_text, "tag": tag or None, "at": _now_iso()}

    mission_ref.set(
        {"missionId": mission_id, "choices": firestore.ArrayUnion([choice_item]), "updated_at": datetime.utcnow()},
        merge=True,
    )

    if tag:
        user_ref.set({"traits": {tag: firestore.Increment(1)}, "updatedAt": datetime.utcnow()}, merge=True)

def save_final_summary(user_id: str, mission_id: str, summary: str) -> str:
    mission_ref = db.collection("users").document(user_id).collection("missions").document(mission_id)
    completed_at = datetime.utcnow()
    mission_ref.set(
        {"missionId": mission_id, "final_summary": summary, "completed_at": completed_at, "updated_at": completed_at},
        merge=True,
    )
    return completed_at.isoformat() + "Z"

def get_user_traits(user_id: str) -> Dict[str, int]:
    doc = db.collection("users").document(user_id).get()
    traits = doc.to_dict().get("traits", {}) if doc.exists else {}
    base = {"cautious": 0, "bold": 0, "creative": 0, "risk_taker": 0}
    return {**base, **traits}

def get_mission_history(user_id: str) -> List[Dict]:
    q = db.collection("users").document(user_id).collection("missions").get()
    missions = []
    for d in q:
        data = d.to_dict() or {}
        missions.append(
            {
                "mission_id": d.id,
                "completed_at": data.get("completed_at").isoformat() + "Z" if data.get("completed_at") else None,
                "choices": data.get("choices", []),
                "final_summary": data.get("final_summary"),
            }
        )
    missions.sort(key=lambda m: m["completed_at"] or "", reverse=True)
    return missions
