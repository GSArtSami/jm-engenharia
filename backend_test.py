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

# Realistic test data for constructions
CONSTRUCTION_TEST_DATA = {
    "name": "Casa Moderna com Terreno Incluso",
    "location": "Condomínio Residencial Vila Verde, Cotia - SP",
    "description": "Projeto completo de casa moderna de 180m² em terreno de 300m². Inclui 3 suítes, sala ampla, cozinha gourmet e área de lazer.",
    "landPrice": "R$ 250.000",
    "constructionPrice": "R$ 450.000",
    "landArea": "300m²",
    "builtArea": "180m²",
    "totalPrice": "R$ 700.000",
    "images": [
        "/api/uploads/casa-moderna-1.jpg",
        "/api/uploads/casa-moderna-2.jpg"
    ]
}

# Realistic test data for simulations
SIMULATION_TEST_DATA = {
    "client_name": "João Carlos Oliveira",
    "client_phone": "(11) 98765-4321",
    "income": "8500",
    "income_label": "R$ 8.500",
    "property_value": "450000",
    "property_value_label": "R$ 450.000",
    "result_data": {
        "taxa_juros": "10.5%",
        "entrada": "R$ 90.000",
        "valor_liberado": "R$ 360.000",
        "sac_parcelas": "R$ 2.850",
        "price_parcelas": "R$ 3.120",
        "aprovado": True
    }
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
    
    def test_admin_appointments_api(self):
        """Test Admin Appointments API"""
        print("\n=== Testing Admin Appointments API ===")
        
        if not self.admin_token:
            self.log_result("Admin Appointments API", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        appointment_id = None
        
        try:
            # First create an appointment via public endpoint
            response = self.session.post(
                f"{BACKEND_URL}/appointments",
                json=APPOINTMENT_TEST_DATA,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("appointment", {}).get("id"):
                    appointment_id = data["appointment"]["id"]
                    self.log_result("Create Appointment (Public)", True, f"Created appointment with ID: {appointment_id}")
                else:
                    self.log_result("Create Appointment (Public)", False, "Create response missing success/appointment.id", data)
                    return False
            else:
                self.log_result("Create Appointment (Public)", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test GET all appointments (admin endpoint)
            response = self.session.get(f"{BACKEND_URL}/admin/appointments", headers=headers, timeout=10)
            if response.status_code == 200:
                appointments = response.json()
                self.log_result("Admin GET Appointments", True, f"Retrieved {len(appointments)} appointments")
            else:
                self.log_result("Admin GET Appointments", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test PUT update appointment status (admin endpoint)
            if appointment_id:
                response = self.session.put(
                    f"{BACKEND_URL}/admin/appointments/{appointment_id}/status",
                    json={"status": "confirmed"},
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Admin Update Appointment Status", True, f"Updated appointment {appointment_id} to confirmed")
                    else:
                        self.log_result("Admin Update Appointment Status", False, "Update response missing success", data)
                else:
                    self.log_result("Admin Update Appointment Status", False, f"HTTP {response.status_code}", response.text)
            
            # Test DELETE appointment (admin endpoint)
            if appointment_id:
                response = self.session.delete(
                    f"{BACKEND_URL}/admin/appointments/{appointment_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Admin DELETE Appointment", True, f"Deleted appointment {appointment_id}")
                    else:
                        self.log_result("Admin DELETE Appointment", False, "Delete response missing success", data)
                else:
                    self.log_result("Admin DELETE Appointment", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Admin Appointments API", False, f"Request failed: {str(e)}")
            return False
    
    def test_admin_unavailable_dates_api(self):
        """Test Admin Unavailable Dates API"""
        print("\n=== Testing Admin Unavailable Dates API ===")
        
        if not self.admin_token:
            self.log_result("Admin Unavailable Dates API", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        test_date = "2026-01-20"
        
        try:
            # Test GET unavailable dates (admin endpoint)
            response = self.session.get(f"{BACKEND_URL}/admin/unavailable-dates", headers=headers, timeout=10)
            if response.status_code == 200:
                dates = response.json()
                self.log_result("Admin GET Unavailable Dates", True, f"Retrieved {len(dates)} unavailable dates")
            else:
                self.log_result("Admin GET Unavailable Dates", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test POST add unavailable date (admin endpoint)
            response = self.session.post(
                f"{BACKEND_URL}/admin/unavailable-dates",
                json={"date": test_date},
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("Admin POST Unavailable Date", True, f"Added unavailable date: {test_date}")
                else:
                    self.log_result("Admin POST Unavailable Date", False, "Post response missing success", data)
            else:
                self.log_result("Admin POST Unavailable Date", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test DELETE unavailable date (admin endpoint)
            response = self.session.delete(
                f"{BACKEND_URL}/admin/unavailable-dates/{test_date}",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("Admin DELETE Unavailable Date", True, f"Removed unavailable date: {test_date}")
                else:
                    self.log_result("Admin DELETE Unavailable Date", False, "Delete response missing success", data)
            else:
                self.log_result("Admin DELETE Unavailable Date", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Admin Unavailable Dates API", False, f"Request failed: {str(e)}")
            return False
    
    def test_file_upload_api(self):
        """Test File Upload API"""
        print("\n=== Testing File Upload API ===")
        
        if not self.admin_token:
            self.log_result("File Upload API", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        try:
            # Create a simple test image file (1x1 pixel PNG)
            import io
            test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x0cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1c\x00\x00\x00\x00IEND\xaeB`\x82'
            
            # Test POST upload
            files = {"file": ("test_image.png", io.BytesIO(test_image_data), "image/png")}
            response = self.session.post(
                f"{BACKEND_URL}/admin/upload",
                files=files,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("url"):
                    uploaded_url = data["url"]
                    self.log_result("File Upload POST", True, f"File uploaded successfully: {uploaded_url}")
                    
                    # Test GET uploaded file
                    filename = uploaded_url.split("/")[-1]
                    response = self.session.get(
                        f"{BACKEND_URL}/uploads/{filename}",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        self.log_result("File Upload GET", True, f"File served successfully: {filename}")
                        return True
                    else:
                        self.log_result("File Upload GET", False, f"HTTP {response.status_code}", response.text)
                        return False
                else:
                    self.log_result("File Upload POST", False, "Upload response missing success/url", data)
                    return False
            else:
                self.log_result("File Upload POST", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("File Upload API", False, f"Request failed: {str(e)}")
            return False
    
    def test_constructions_crud(self):
        """Test Constructions CRUD operations"""
        print("\n=== Testing Constructions CRUD API ===")
        
        if not self.admin_token:
            self.log_result("Constructions CRUD", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        construction_id = None
        
        try:
            # Test GET all constructions
            response = self.session.get(f"{BACKEND_URL}/admin/constructions", headers=headers, timeout=10)
            if response.status_code == 200:
                constructions = response.json()
                self.log_result("Constructions GET", True, f"Retrieved {len(constructions)} constructions")
            else:
                self.log_result("Constructions GET", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test POST create construction
            response = self.session.post(
                f"{BACKEND_URL}/admin/constructions",
                json=CONSTRUCTION_TEST_DATA,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("construction", {}).get("id"):
                    construction_id = data["construction"]["id"]
                    self.log_result("Constructions POST", True, f"Created construction with ID: {construction_id}")
                else:
                    self.log_result("Constructions POST", False, "Create response missing success/construction.id", data)
                    return False
            else:
                self.log_result("Constructions POST", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test PUT update construction
            if construction_id:
                updated_data = CONSTRUCTION_TEST_DATA.copy()
                updated_data["name"] = "Casa Moderna ATUALIZADA com Terreno"
                
                response = self.session.put(
                    f"{BACKEND_URL}/admin/constructions/{construction_id}",
                    json=updated_data,
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Constructions PUT", True, f"Updated construction {construction_id}")
                    else:
                        self.log_result("Constructions PUT", False, "Update response missing success", data)
                else:
                    self.log_result("Constructions PUT", False, f"HTTP {response.status_code}", response.text)
            
            # Test DELETE construction
            if construction_id:
                response = self.session.delete(
                    f"{BACKEND_URL}/admin/constructions/{construction_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Constructions DELETE", True, f"Deleted construction {construction_id}")
                    else:
                        self.log_result("Constructions DELETE", False, "Delete response missing success", data)
                else:
                    self.log_result("Constructions DELETE", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Constructions CRUD", False, f"Request failed: {str(e)}")
            return False
    
    def test_simulations_api(self):
        """Test Simulations API (both public save and admin management)"""
        print("\n=== Testing Simulations API ===")
        
        simulation_id = None
        
        try:
            # Test POST save simulation (public endpoint)
            response = self.session.post(
                f"{BACKEND_URL}/simulations",
                json=SIMULATION_TEST_DATA,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("id"):
                    simulation_id = data["id"]
                    self.log_result("Simulations POST (Public)", True, f"Saved simulation with ID: {simulation_id}")
                else:
                    self.log_result("Simulations POST (Public)", False, "Save response missing success/id", data)
                    return False
            else:
                self.log_result("Simulations POST (Public)", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test admin endpoints (require token)
            if not self.admin_token:
                self.log_result("Simulations Admin API", False, "No admin token available")
                return False
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test GET all simulations (admin endpoint)
            response = self.session.get(f"{BACKEND_URL}/admin/simulations", headers=headers, timeout=10)
            if response.status_code == 200:
                simulations = response.json()
                self.log_result("Simulations GET (Admin)", True, f"Retrieved {len(simulations)} simulations")
                
                # Verify our simulation is in the list
                found_simulation = any(sim.get("id") == simulation_id for sim in simulations)
                if found_simulation:
                    self.log_result("Simulations Verification", True, "Created simulation found in admin list")
                else:
                    self.log_result("Simulations Verification", False, "Created simulation not found in admin list")
            else:
                self.log_result("Simulations GET (Admin)", False, f"HTTP {response.status_code}", response.text)
                return False
            
            # Test DELETE simulation (admin endpoint)
            if simulation_id:
                response = self.session.delete(
                    f"{BACKEND_URL}/admin/simulations/{simulation_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_result("Simulations DELETE (Admin)", True, f"Deleted simulation {simulation_id}")
                    else:
                        self.log_result("Simulations DELETE (Admin)", False, "Delete response missing success", data)
                else:
                    self.log_result("Simulations DELETE (Admin)", False, f"HTTP {response.status_code}", response.text)
            
            return True
            
        except Exception as e:
            self.log_result("Simulations API", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests focusing on admin panel features"""
        print("🚀 Starting JM Engenharia Admin Panel Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Test admin login first (required for other tests)
        login_success = self.test_admin_login()
        
        if login_success:
            # Test admin-specific APIs
            self.test_admin_appointments_api()
            self.test_admin_unavailable_dates_api()
            self.test_analytics_api()
            
            # Test CRUD operations (optional - already tested in previous runs)
            # self.test_properties_crud()
            # self.test_lands_crud()
        else:
            print("❌ Admin login failed - skipping admin-only tests")
        
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