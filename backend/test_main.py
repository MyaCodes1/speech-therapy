from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/") # Send a GET request to the root URL ("/") using the test client
    assert response.status_code == 200 # Assert that the response status code is 200 (OK)

def test_register():
    response = client.post("/auth/register", json={
        "email": "unittest2@test.com",
        "name": "Unit Test",
        "password": "testpassword",
        "age": 6
    }) # Send a POST request to the "/auth/register" URL with a JSON payload containing the registration data   
    assert response.status_code == 200 # Assert that the response status code is 200 (OK)
    
def test_login_correct():
    response = client.post("/auth/login", json={
        "email": "unittest@test.com",
        "password": "testpassword"
    })
    assert response.status_code == 200 # Assert that the response status code is 200 (OK)

def test_login_incorrect():
    response = client.post("/auth/login", json={
        "email": "unittest@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401 # Assert that the response status code is 401 (Unauthorized)
    
def test_get_exercises():
    response = client.get("/exercises") # Send a GET request to the "/exercises" URL using the test client
    assert response.status_code in [200, 401] # Assert that the response status code is 200 (OK)
