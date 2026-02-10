from fastapi import APIRouter
from backend.core.supabase import supabase

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}



@router.get("/supabase-test")
def supabase_test():
    res = supabase.table("profiles").select("*").limit(5).execute()
    return {"data": res.data}
