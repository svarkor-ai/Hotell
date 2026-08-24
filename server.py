"""vm106 hosting entrypoint for svarkor-ai/hotell (MC#2317).

The vm106 renderer runs `python server.py` with NO PORT env; nginx proxies
sibbamala.com/hotell/ -> 127.0.0.1:8117. run.py binds 8000 with reload=True; this shim
binds the manifest PORT (default 8117) on 0.0.0.0 with no reload (production).
"""
import os

import uvicorn

if __name__ == "__main__":
    # app.config.DB_URL = sqlite:///./.data/hotel.db -> ensure the dir exists
    os.makedirs(".data", exist_ok=True)
    port = int(os.environ.get("PORT", "8117"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
