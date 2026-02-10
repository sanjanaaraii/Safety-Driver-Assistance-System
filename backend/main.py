from fastapi import FastAPI
from backend.api.v1 import health, auth

app = FastAPI(title="SDAS Backend")


app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "SDAS backend running"}
