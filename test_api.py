"""Test API with Bearer tokens"""
import requests
import json
from datetime import datetime

API_BASE = "http://localhost:5000/api"
ADMIN_TOKEN = f"demo-admin-token-{int(datetime.now().timestamp() * 1000)}"

print("=" * 60)
print("TESTING API WITH BEARER TOKEN AUTHENTICATION")
print("=" * 60)
print(f"\nAdmin Token: {ADMIN_TOKEN}\n")

# Test 1: Create a school
print("[TEST 1] Creating a school with Bearer token...")
headers = {
    "Authorization": f"Bearer {ADMIN_TOKEN}",
    "Content-Type": "application/json"
}

school_data = {
    "name": "Test School",
    "category": "PRIMARY",
    "location": "Nairobi",
    "region": "Nairobi County",
    "students": 500,
    "contact": "+254712345678",
    "email": "testschool@example.com",
    "website": "https://testschool.com",
    "description": "A test school for API verification"
}

response = requests.post(f"{API_BASE}/schools", json=school_data, headers=headers)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 201:
    school_id = response.json().get('id')
    print(f"\n✅ SUCCESS! School created with ID: {school_id}")
else:
    print(f"\n❌ FAILED! Expected 201, got {response.status_code}")

# Test 2: Get all schools
print("\n" + "=" * 60)
print("[TEST 2] Getting all schools...")
response = requests.get(f"{API_BASE}/schools")
print(f"Status Code: {response.status_code}")
schools = response.json()
print(f"Number of schools: {len(schools)}")
if schools:
    print(f"First school: {schools[0].get('name')}")
    print("✅ SUCCESS! Schools retrieved")
else:
    print("❌ NO SCHOOLS FOUND")

print("\n" + "=" * 60)
print("API TEST COMPLETE")
print("=" * 60)
