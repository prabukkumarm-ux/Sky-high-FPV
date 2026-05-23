import json
import os
import shutil
import mimetypes
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")

app = FastAPI(title="Sky High FPV CMS")

DATA_FILE = "data.json"
UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Helper to read/write data
def read_data():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# Simple auth dependency
def verify_token(authorization: Optional[str] = Header(None)):
    if authorization != "Bearer admin-token":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# Login model
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin123":
        return {"token": "admin-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Get content
@app.get("/api/content")
def get_content():
    return read_data()

# Update General
@app.post("/api/content/general")
def update_general(data: dict, authorized: bool = Depends(verify_token)):
    content = read_data()
    content["general"] = data
    write_data(content)
    return {"status": "success"}

# Update Hero
@app.post("/api/content/hero")
def update_hero(data: dict, authorized: bool = Depends(verify_token)):
    content = read_data()
    content["hero"] = data
    write_data(content)
    return {"status": "success"}

# Update Services
@app.post("/api/content/services")
def update_services(data: list, authorized: bool = Depends(verify_token)):
    content = read_data()
    content["services"] = data
    write_data(content)
    return {"status": "success"}

# Update Projects
@app.post("/api/content/projects")
def update_projects(data: list, authorized: bool = Depends(verify_token)):
    content = read_data()
    content["projects"] = data
    write_data(content)
    return {"status": "success"}

# Upload Image
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), authorized: bool = Depends(verify_token)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/{UPLOAD_DIR}/{file.filename}"}

@app.get("/admin")
def admin_redirect():
    return RedirectResponse(url="/admin.html")

# Serve static files (HTML, JS, CSS, and uploads)
app.mount(f"/{UPLOAD_DIR}", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/", StaticFiles(directory=".", html=True), name="static")
