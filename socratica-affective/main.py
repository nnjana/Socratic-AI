# main.py
from fastapi import FastAPI
from routes import voice_routes

app = FastAPI()

# Mount the external voice routes
app.include_router(voice_routes.router)

@app.get("/ping")
def ping_test():
    return {"message": "Hello from FastAPI!"}

@app.get("/health")
def read_health():
    return {"status": "Affective ML Engine is running securely."}