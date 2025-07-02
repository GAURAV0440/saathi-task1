import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

PROMPT = """
Extract the following fields from the visa query and return a VALID JSON object:
- destination
- passport_country
- travel_date
- purpose

ONLY return a JSON object. Do not include any explanations or formatting.
Query: {query}
"""

# Retry Gemini call up to 3 times on failure
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(Exception),
    reraise=True
)
def call_gemini_model(query: str) -> str:
    model = genai.GenerativeModel(MODEL_NAME)
    print("Sending query to Gemini:", query)
    response = model.generate_content(PROMPT.format(query=query))
    return response.text.strip()

# Clean markdown from Gemini JSON output (e.g., ```json ... ```)
def clean_markdown_json(text: str) -> str:
    if text.startswith("```"):
        lines = text.splitlines()
        cleaned = "\n".join(line for line in lines if not line.strip().startswith("```"))
        return cleaned.strip()
    return text.strip()

# Main function used by FastAPI
def extract_fields_from_query(query: str):
    try:
        result = call_gemini_model(query)
        cleaned = clean_markdown_json(result)
        print("Gemini raw cleaned response:\n", cleaned)
        return cleaned
    except Exception as e:
        print("❌ Gemini API error:", e)
        return json.dumps({"error": "Gemini API call failed", "details": str(e)})
