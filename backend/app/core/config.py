import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

# Single User Mode — your personal Supabase user ID
USER_ID = os.getenv("USER_ID")

if not USER_ID:
    raise ValueError("USER_ID is missing from environment variables. Add USER_ID=<your_supabase_user_id> to backend/.env")