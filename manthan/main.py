from fin_rag_assistant.api.server import app

import uvicorn


if __name__ == "__main__":
    uvicorn.run("fin_rag_assistant.api.server:app", host="127.0.0.1", port=8000, reload=True)
