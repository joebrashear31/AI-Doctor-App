import os
import requests

# Required env
OPENROUTER_API_KEY = os.environ["OPENROUTER_API_KEY"]

# Optional env with defaults for local dev
OPENROUTER_BASE = os.getenv("OPENROUTER_BASE", "https://openrouter.ai/api/v1")
APP_REFERER = os.getenv("APP_REFERER", "http://localhost:8000")
APP_TITLE = os.getenv("APP_TITLE", "AI Doctor App")

# Default model (you can override via env)
MODEL = os.getenv("MODEL", "meta-llama/llama-3.3-70b-instruct:free")

def chat_completion(messages, temperature: float = 0.1,
                    response_format: dict | None = {"type": "json_object"},
                    extra: dict | None = None) -> str:
    """
    Calls OpenRouter Chat Completions and returns assistant message content (string).
    Adds a guardrail system message to enforce JSON-only output.
    """
    guard = {
        "role": "system",
        "content": (
            "Return ONLY valid JSON. No prose, no comments, no markdown, no backticks. "
            "If unsure, return an empty structure but keep valid JSON."
        ),
    }
    msgs = [guard, *messages]

    payload = {
        "model": MODEL,
        "messages": msgs,
        "temperature": float(temperature),
        "top_p": 1,
    }
    if response_format:
        payload["response_format"] = response_format
    if extra:
        payload.update(extra)

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        # Attribution headers (recommended by OpenRouter)
        "HTTP-Referer": APP_REFERER,
        "X-Title": APP_TITLE,
    }

    url = f"{OPENROUTER_BASE}/chat/completions"
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    r.raise_for_status()
    data = r.json()
    return data["choices"][0]["message"]["content"]
