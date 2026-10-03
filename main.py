import sys
import os
from pathlib import Path
import importlib.util

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"

for p in [str(BACKEND_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Load app from backend/main.py without circular import
backend_main_path = BACKEND_DIR / "main.py"
spec = importlib.util.spec_from_file_location("backend_main", str(backend_main_path))
backend_main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend_main)
app = backend_main.app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
