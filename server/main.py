from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from server.openrouter_client import chat_completion
from server.models import *
import re, json, os

app = FastAPI(title="AI Doctor Backend (OpenRouter)")

# --- CORS (dev-friendly) ---
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Simple rules: triage red flags ---
RED_FLAGS = [
    r"\b(chest pain|pressure in chest)\b",
    r"\b(short(ness)? of breath|difficulty breathing)\b",
    r"\b(stroke|slurred speech|face droop|arm weakness)\b",
    r"\b(uncontrolled bleeding|faint|fainting)\b",
    r"\b(anaphylaxis|severe allergy)\b",
    r"\b(suicidal|kill myself|end my life)\b",
]

def triage_rules(text: str) -> TriageOut:
    t = text.lower()
    red = [p for p in RED_FLAGS if re.search(p, t)]
    if red:
        return TriageOut(
            risk="emergency",
            next_step="call_emergency",
            red_flags=red,
            disclaimer="Possible emergency. Call 911 (or local equivalent)."
        )
    return TriageOut(
        risk="routine",
        next_step="self_care",
        red_flags=[],
        disclaimer="This is not a diagnosis. If symptoms worsen, seek medical care."
    )

# --- Patient safety: block dosing to patients ---
PATIENT_RX_BLOCK = re.compile(r"\b(take|start|increase|decrease)\b.*\b(mg|tablet|capsule|ml)\b", re.I)

def require_json(output: str):
    try:
        return json.loads(output)
    except json.JSONDecodeError:
        raise HTTPException(502, f"Model did not return valid JSON: {output[:200]}")

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/triage", response_model=TriageOut)
def route_trage(inp: SymptomInput):
    return triage_rules(inp.symptoms)

@app.post("/advice", response_model=AdviceOut)
def route_advice(inp: SymptomInput):
    triage = triage_rules(inp.symptoms)
    if triage.risk == "emergency":
        raise HTTPException(400, "Possible emergency. Call emergency services now.")

    system = ("You are a clinical decision support assistant. "
              "Do NOT diagnose. Do NOT provide medication names/doses to patients. "
              "Return ONLY valid JSON with keys: advice[], when_to_seek_care[], disclaimer.")
    user = (f"Age: {inp.age}\nSex: {inp.sex}\nSymptoms: {inp.symptoms}\n"
            f"Duration: {inp.duration}\nMeds: {inp.meds}\nConditions: {inp.conditions}\n"
            "JSON shape:\n{\n  \"advice\":[{\"step\":\"string\",\"details\":\"string\"}],\n"
            "  \"when_to_seek_care\":[\"string\"],\n  \"disclaimer\":\"string\"\n}")

    content = chat_completion(
        messages=[{"role":"system","content":system},{"role":"user","content":user}],
        temperature=0.2,
        response_format={"type":"json_object"}  # JSON-mode hint if supported
    )
    data = require_json(content)

    # post-filter: block dosing language accidentally shown to patient
    all_text = " ".join([f"{x.get('step','')} {x.get('details','')}" for x in data.get("advice", [])])
