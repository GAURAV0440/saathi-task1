from fastapi import FastAPI
from pydantic import BaseModel
from parser.query_parser import extract_fields_from_query
import json
import os

app = FastAPI()
LOG_FILE = "output_log.json"

class QueryRequest(BaseModel):
    query: str

# Save every query + response to output_log.json
def append_to_log(query: str, result: dict):
    log_entry = {
        "query": query,
        "response": result
    }

    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r+", encoding="utf-8") as file:
            data = json.load(file)
            data.append(log_entry)
            file.seek(0)
            json.dump(data, file, indent=2)
    else:
        with open(LOG_FILE, "w", encoding="utf-8") as file:
            json.dump([log_entry], file, indent=2)

@app.post("/parse-visa-query")
async def parse_visa_query(data: QueryRequest):
    try:
        result_raw = extract_fields_from_query(data.query)
        try:
            result_json = json.loads(result_raw)
            append_to_log(data.query, result_json)
            return result_json
        except json.JSONDecodeError:
            fallback = {
                "raw_response": result_raw,
                "warning": "Gemini response was not valid JSON. Check the format manually."
            }
            append_to_log(data.query, fallback)
            return fallback
    except Exception as e:
        error_obj = {"error": str(e)}
        append_to_log(data.query, error_obj)
        return error_obj
