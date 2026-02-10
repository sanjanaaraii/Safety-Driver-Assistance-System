from fastapi import APIRouter, Depends
from backend.core.security import get_current_user
from backend.core.supabase import supabase

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    profile = supabase.table("profiles") \
        .select("*") \
        .eq("id", user.id) \
        .single() \
        .execute()

    return {
        "id": user.id,
        "email": user.email,
        "role": profile.data["role"],
        "profile": profile.data
    }
