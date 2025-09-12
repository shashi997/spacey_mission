# server/app/firebase_init.py
import os
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        firebase_admin.initialize_app(credentials.ApplicationDefault())
    elif os.path.exists("service-account.json"):
        firebase_admin.initialize_app(credentials.Certificate("service-account.json"))
    else:
        raise RuntimeError(
            "Firebase credentials missing. Set GOOGLE_APPLICATION_CREDENTIALS "
            "or place service-account.json next to the server."
        )

db = firestore.client()
