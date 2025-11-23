# simple_test.py
import requests

BASE_URL = "http://127.0.0.1:8000"

# Test login
response = requests.post(f"{BASE_URL}/api/auth/login", json={
    "username": "admin",
    "password": "admin123"
})

print(f"Login status: {response.status_code}")
print(f"Login response: {response.text}")

if response.status_code == 200:
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test getting loans
    loans_response = requests.get(f"{BASE_URL}/api/loans/", headers=headers)
    print(f"\nLoans status: {loans_response.status_code}")
    print(f"Loans response: {loans_response.text}")