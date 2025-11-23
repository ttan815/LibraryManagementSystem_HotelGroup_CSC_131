# test_backend.py
import requests
import sys

def test_backend():
    print("Testing backend connection...")
    
    # Test 1: Basic connection
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend on port 8000")
        print("Make sure you ran: python main.py")
        return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: Check if admin user exists and can login
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(
            "http://localhost:8000/api/auth/login",
            data=login_data,
            timeout=5
        )
        print(f"✅ Login test: {response.status_code}")
        
        if response.status_code == 200:
            print("🎉 Login successful!")
            token_data = response.json()
            print(f"Token type: {token_data.get('token_type')}")
            return True
        else:
            print(f"❌ Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False

if __name__ == "__main__":
    test_backend()