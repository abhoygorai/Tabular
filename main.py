from fastapi import FastAPI, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from typing import List,Annotated
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

import db_initialization

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

fake_users_db = []

class User(BaseModel):
    username: str
    password: str

@app.post("/signup/")
def sign_up(user: User):
    db_initialization.insert_registration_data(user.username, user.password)
    return {"message": "User created successfully"}

# Route for user login (sign in)
@app.post("/login/")
def login(user: User):
    user_data = db_initialization.fetch_user_data(user.username)
    if user_data is None:  # Assuming password is in the third column
        raise HTTPException(status_code=401, detail="Invalid username")
    
    elif user_data[2] != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"message": "Login successful"}

@app.post("/fetchdata")
async def mediaData(request: Request):
    bodyData = await request.json()
    keyword = bodyData.get('keyword')
    platform = bodyData.get('platform')
    fromDate = bodyData.get('fromDate')
    toDate = bodyData.get('toDate')
    pageNumber = bodyData.get('pageNumber')
    print(bodyData)
    data, row_count = db_initialization.getMediaData(platform, keyword, fromDate, toDate, pageNumber)
    return [data, row_count]



if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)