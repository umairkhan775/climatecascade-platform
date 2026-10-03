import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import tempfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# On Vercel / serverless environments, /var/task is read-only.
# tempfile.gettempdir() (/tmp on Linux/Vercel) is the only writable directory.
is_serverless = os.getenv("VERCEL") == "1" or os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None

if is_serverless:
    DATA_DIR = os.path.join(tempfile.gettempdir(), "climatecascade")
    os.makedirs(DATA_DIR, exist_ok=True)
    bundled_db = os.path.join(BASE_DIR, "data", "climatecascade.db")
    tmp_db = os.path.join(DATA_DIR, "climatecascade.db")
    # Copy bundled database to writable location if not already present
    if os.path.exists(bundled_db) and not os.path.exists(tmp_db):
        try:
            shutil.copyfile(bundled_db, tmp_db)
        except Exception:
            pass
else:
    DATA_DIR = os.path.join(BASE_DIR, "data")
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
    except OSError:
        DATA_DIR = os.path.join(tempfile.gettempdir(), "climatecascade")
        os.makedirs(DATA_DIR, exist_ok=True)

db_file_path = os.path.join(DATA_DIR, 'climatecascade.db').replace('\\', '/')
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_file_path}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
