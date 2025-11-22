# test_login.py
import urllib.request
import urllib.parse
import json

def test_login():
    print("Testing login with new admin user...")
    
    try:
        login_data = urllib.parse.urlencode({
            'username': 'admin',
            'password': 'admin123'
        }).encode('utf-8')
        
        req = urllib.request.Request(
            'http://localhost:8000/api/auth/login',
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            result = json.loads(data)
            print(f"✅ Login successful!")
            print(f"Token type: {result.get('token_type')}")
            print(f"Access token: {result.get('access_token')[:50]}...")
            return True
            
    except urllib.error.HTTPError as e:
        error_data = e.read().decode('utf-8')
        print(f"❌ Login failed ({e.code}): {error_data}")
        return False
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False

if __name__ == "__main__":
    test_login()