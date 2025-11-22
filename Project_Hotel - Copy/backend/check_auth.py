# check_auth.py
import sys
sys.path.append('.')
from auth import verify_password, get_password_hash, create_access_token

def check_auth():
    print("Checking auth module...")
    try:
        # Test password hashing
        test_password = "test123"
        hashed = get_password_hash(test_password)
        print(f"✅ Password hashing works")
        
        # Test password verification
        verify_result = verify_password(test_password, hashed)
        print(f"✅ Password verification works: {verify_result}")
        
        # Test token creation
        token = create_access_token({"sub": "testuser"})
        print(f"✅ Token creation works")
        
        return True
    except Exception as e:
        print(f"❌ Auth module error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_auth()