import os, requests

OPENROUTER_API_KEY = os.environ["OPENROUTER_API_KEY"]  # REQUIRED
OPENROUTER_BASE = os.getenv("OPENROUTER_BASE", "https://openrouter.ai/api/v1")
APP_REFERER = os.getenv("APP_REFERER", "https://yourdomain.example")  # optional but recommended
APP_TITLE = os.getenv("APP_TITLE", "AI Doctor App")                   # optional
MODEL = os.getenv("MODEL", "meta-llama/llama-3.3-70b-instruct:free")

def chat_completion(messages, temperature=0.2, response_format=None, extra=None) -> str:
    """
    messages: [{"role":"system"|"user"|"assistant","content":"..."}]
    Returns assistant content (string).
    """
    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": float(temperature),
    }
    if response_format:
        payload["response_format"] = response_format
    if extra:
        payload.update(extra)

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": APP_REFERER,
        "X-Title": APP_TITLE,
    }
    url = f"{OPENROUTER_BASE}/chat/completions"
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    r.raise_for_status()
    data = r.json()
    return data["choices"][0]["message"]["content"]
