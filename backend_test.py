#!/usr/bin/env python3
"""
Backend API Testing for JM Engenharia Real Estate Website
Tests all backend endpoints with realistic Portuguese data
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Backend URL from environment
BACKEND_URL = "https://casaterra.preview.emergentagent.com/api"

# Test data in Portuguese
ADMIN_PASSWORD = "JM@engcivil"

# Realistic test data for properties
PROPERTY_TEST_DATA = {
    "name": "Casa Moderna em Condomínio Fechado",
    "location": "Alphaville, Barueri - SP",
    "description": "Linda casa com 3 suítes, piscina e área gourmet. Localizada em condomínio de alto padrão com segurança 24h.",
    "bedrooms": 3,
    "badge": "Lançamento",
    "image": "https://example.com/casa-moderna.jpg",
    "amenities": [
        {"name": "Piscina", "icon": "🏊"},
        {"name": "Área Gourmet", "icon": "🍖"},
        {"name": "Segurança 24h", "icon": "🛡️"}
    ],
    "propertyValue": "R$ 850.000"
}

# Realistic test data for lands
LAND_TEST_DATA = {
    "name": "Terreno Residencial Premium",
    "location": "Granja Viana, Cotia - SP",
    "description": "Terreno plano de 500m² em condomínio fechado, pronto para construir sua casa dos sonhos.",
    "image": "https://example.com/terreno-premium.jpg",
    "area": "500m²",
    "price": "R$ 320.000"
}

# Realistic test data for appointments
APPOINTMENT_TEST_DATA = {
    "name": "Maria Silva Santos",
    "email": "maria.santos@email.com",
    "phone": "(11) 99999-8888",
    "preferred_date": "2024-02-15",
    "preferred_time": "14:00",
    "message": "Gostaria de conhecer as opções de casas prontas na região de Alphaville."
}

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details
        })
    
    def test_admin_login(self):
        """Test admin login endpoint"""
        print("\n=== Testing Admin Login API ===")
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/admin/login",
                json={"password": ADMIN_PASSWORD},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("token"):
                    self.admin_token = data["token"]
                    self.log_result("Admin Login", True, "Login successful with JWT token")
                    return True
                else:
                    self.log_result("Admin Login", False, "Login response missing success/token", data)
                    return False
            else:
                self.log_result("Admin Login", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Login", False, f"Request failed: {str(e)}")
            return False
    
    def test_properties_crud(self):
        """Test Properties CRUD operations"""
        print("\n=== Testing Properties CRUD API ===")
        
        if not self.admin_token:
            self.log_result("Properties CRUD", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        property_id = None
        
        try:
            # Test GET all properties
            response = self.session.get(f"{BACKEND_URL}/admin/properties", headers=headers, timeout=10)
            if response.status_code == 200:
                properties = response.json()
                self.log_result("Properties GET", True, f"Retrieved {len(properties)} properties")
            else:
                self.log_result("Properties GET", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test POST create property
            response = self.session.post(
                f"{BACKEND_URL}/admin/properties",
                json=PROPERTY_TEST_DATA,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("property", {}).get("id"):
                    property_id = data["property"]["id"]
                    self.log_result("Properties POST", True, f"Created property with ID: {property_id}")
                else:
                    self.log_result("Properties POST", False, "Create response missing success/property.id", data)
                    return False
            else:
                self.log_result("Properties POST", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test PUT update property
            if property_id:
                updated_data = PROPERTY_TEST_DATA.copy()
                updated_data["name"] = "Casa Moderna ATUALIZADA"
                
                response = self.session.put(
                    f"{BACKEND_URL}/admin/properties/{property_id}",
                    json=updated_data,
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Properties PUT", True, f"Updated property {property_id}")
                    else:
                        self.log_result("Properties PUT", False, "Update response missing success", data)
                else:
                    self.log_result("Properties PUT", False, f"HTTP {response.status_code}", response.text)
            
            # Test DELETE property
            if property_id:
                response = self.session.delete(
                    f"{BACKEND_URL}/admin/properties/{property_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Properties DELETE", True, f"Deleted property {property_id}")
                    else:
                        self.log_result("Properties DELETE", False, "Delete response missing success", data)
                else:
                    self.log_result("Properties DELETE", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Properties CRUD", False, f"Request failed: {str(e)}")
            return False
    
    def test_lands_crud(self):
        """Test Lands CRUD operations"""
        print("\n=== Testing Lands CRUD API ===")
        
        if not self.admin_token:
            self.log_result("Lands CRUD", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        land_id = None
        
        try:
            # Test GET all lands
            response = self.session.get(f"{BACKEND_URL}/admin/lands", headers=headers, timeout=10)
            if response.status_code == 200:
                lands = response.json()
                self.log_result("Lands GET", True, f"Retrieved {len(lands)} lands")
            else:
                self.log_result("Lands GET", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test POST create land
            response = self.session.post(
                f"{BACKEND_URL}/admin/lands",
                json=LAND_TEST_DATA,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("land", {}).get("id"):
                    land_id = data["land"]["id"]
                    self.log_result("Lands POST", True, f"Created land with ID: {land_id}")
                else:
                    self.log_result("Lands POST", False, "Create response missing success/land.id", data)
                    return False
            else:
                self.log_result("Lands POST", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test PUT update land
            if land_id:
                updated_data = LAND_TEST_DATA.copy()
                updated_data["name"] = "Terreno Premium ATUALIZADO"
                
                response = self.session.put(
                    f"{BACKEND_URL}/admin/lands/{land_id}",
                    json=updated_data,
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Lands PUT", True, f"Updated land {land_id}")
                    else:
                        self.log_result("Lands PUT", False, "Update response missing success", data)
                else:
                    self.log_result("Lands PUT", False, f"HTTP {response.status_code}", response.text)
            
            # Test DELETE land
            if land_id:
                response = self.session.delete(
                    f"{BACKEND_URL}/admin/lands/{land_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Lands DELETE", True, f"Deleted land {land_id}")
                    else:
                        self.log_result("Lands DELETE", False, "Delete response missing success", data)
                else:
                    self.log_result("Lands DELETE", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Lands CRUD", False, f"Request failed: {str(e)}")
            return False
    
    def test_appointments_api(self):
        """Test Appointments API"""
        print("\n=== Testing Appointments API ===")
        
        try:
            # Test POST create appointment (public endpoint)
            response = self.session.post(
                f"{BACKEND_URL}/appointments",
                json=APPOINTMENT_TEST_DATA,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("appointment", {}).get("id"):
                    appointment_id = data["appointment"]["id"]
                    self.log_result("Appointments POST", True, f"Created appointment with ID: {appointment_id}")
                else:
                    self.log_result("Appointments POST", False, "Create response missing success/appointment.id", data)
                    return False
            else:
                self.log_result("Appointments POST", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test GET unavailable dates (public endpoint)
            response = self.session.get(f"{BACKEND_URL}/unavailable-dates", timeout=10)
            if response.status_code == 200:
                dates = response.json()
                self.log_result("Unavailable Dates GET", True, f"Retrieved {len(dates)} unavailable dates")
            else:
                self.log_result("Unavailable Dates GET", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test GET available slots (public endpoint)
            response = self.session.get(f"{BACKEND_URL}/appointments/available-slots", timeout=10)
            if response.status_code == 200:
                slots = response.json()
                self.log_result("Available Slots GET", True, f"Retrieved {len(slots)} available slot days")
            else:
                self.log_result("Available Slots GET", False, f"HTTP {response.status_code}", response.text)
                return False
            
            return True
            
        except Exception as e:
            self.log_result("Appointments API", False, f"Request failed: {str(e)}")
            return False
    
    def test_analytics_api(self):
        """Test Analytics API"""
        print("\n=== Testing Analytics API ===")
        
        if not self.admin_token:
            self.log_result("Analytics API", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        try:
            # Test GET analytics summary
            response = self.session.get(f"{BACKEND_URL}/admin/analytics/summary", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                expected_keys = ["today", "this_week", "this_month", "total", "unique_today"]
                if all(key in data for key in expected_keys):
                    self.log_result("Analytics Summary", True, f"Retrieved analytics: {data}")
                else:
                    self.log_result("Analytics Summary", False, "Missing expected keys in response", data)
                    return False
            else:
                self.log_result("Analytics Summary", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test GET analytics visits
            response = self.session.get(f"{BACKEND_URL}/admin/analytics/visits", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_result("Analytics Visits", True, f"Retrieved {len(data)} visit records")
            else:
                self.log_result("Analytics Visits", False, f"HTTP {response.status_code}", response.text)
                return False
            
            return True
            
        except Exception as e:
            self.log_result("Analytics API", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting JM Engenharia Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Test admin login first (required for other tests)
        login_success = self.test_admin_login()
        
        # Test all CRUD operations
        self.test_properties_crud()
        self.test_lands_crud()
        
        # Test public APIs
        self.test_appointments_api()
        
        # Test analytics (requires admin token)
        if login_success:
            self.test_analytics_api()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
                    if result["details"]:
                        print(f"    Details: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)