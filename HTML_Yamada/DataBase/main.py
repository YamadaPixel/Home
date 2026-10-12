import csv
import shutil
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
  for path in Path(".").rglob("__pycache__"):
    shutil.rmtree(path, ignore_errors=True)
  yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

CSV_FILE = 'Data.csv'

@app.get("/GetList")
def get_money_list():
  TableList = []
  with open(CSV_FILE, mode='r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for ListData in reader:
      if len(ListData) == 4:
        TableList.append((ListData[0], ListData[1], ListData[2], ListData[3]))
  return TableList

@app.post("/AddContent")
def add_money_record(Date: str, Location: str, Item: str, Amount: str):
  with open(CSV_FILE, mode='a', encoding='utf-8', newline='') as file:
    writer = csv.writer(file)
    writer.writerow([Date, Location, Item, Amount])
  return {"status": "success"}