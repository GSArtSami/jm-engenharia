# JM Engenharia - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of "cury.net" rebranded as "JM Engenharia" with the following features:
- Homepage with 4 navigation cards: Casas Prontas, Terrenos, Construção + Terreno, Simulação de Financiamento
- Property listings filtered by bedrooms (1, 2, 3)
- Financing simulation with specific calculation tables
- Admin panel with password `JM@engcivil` for CRUD operations
- Appointment scheduling with calendar and time slots
- Analytics dashboard

## Tech Stack
- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** FastAPI, Gunicorn (production)
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT for admin panel

## What's Been Implemented

### Core Features (All Complete)
- [x] Homepage with 4 navigation cards
- [x] Properties, Lands, Constructions listings (dynamic from DB)
- [x] Detail pages for each listing type
- [x] Financing simulation page
- [x] Admin panel with full CRUD for all content types
- [x] Multi-image upload support (up to 5 images)
- [x] Appointment scheduling system
- [x] Analytics dashboard
- [x] Floating action buttons (WhatsApp, Scheduling, Simulation)

### Recent Fixes (Jan 2025)
- [x] **Static file serving for uploads** - Added `StaticFiles` mount in `server.py`
- [x] **Public API routes** - Added `/api/properties`, `/api/lands`, `/api/constructions` endpoints
- [x] **Browser compatibility** - Replaced Radix UI selects with native HTML elements
- [x] **Uploads directory** - Auto-creation with fallback for production environments

## API Endpoints

### Public Routes
- `GET /api/properties` - List all properties (filter by `?bedrooms=N`)
- `GET /api/properties/{id}` - Get property details
- `GET /api/lands` - List all lands
- `GET /api/lands/{id}` - Get land details
- `GET /api/constructions` - List all constructions
- `GET /api/constructions/{id}` - Get construction details
- `GET /api/uploads/{filename}` - Serve uploaded images
- `POST /api/simulations` - Save client simulation
- `POST /api/appointments` - Create appointment

### Admin Routes (prefix: /api/admin)
- `POST /login` - Admin authentication
- `POST /upload` - File upload (images)
- Full CRUD for `/properties`, `/lands`, `/constructions`
- `/appointments` - Manage appointments
- `/simulations` - View/delete saved simulations
- `/analytics/*` - Website analytics

## Database Schema

### Collections
- `properties`: {name, location, description, bedrooms, badge, images[], propertyValue, amenities[]}
- `lands`: {name, location, description, images[], area, price}
- `constructions`: {name, location, description, images[], landPrice, constructionPrice, landArea, builtArea, totalPrice}
- `appointments`: {name, email, phone, preferred_date, preferred_time, status, message}
- `simulations`: {client_name, client_phone, income, property_value, result_data}
- `page_visits`: {page, user_ip, user_agent, timestamp}
- `unavailable_dates`: {date}

## Pending Issues

### P1 - User Verification Required
1. **Button Label "Início"** - User reported incorrect label in full-screen mode. Agent could not reproduce. Awaiting user screenshot/feedback.
2. **Simulation Page Chrome Compatibility** - Fixed by replacing custom dropdowns. Pending user confirmation on their Chrome browser.

## Deployment

### Render Platform
A detailed guide exists at `/app/DEPLOY_RENDER_GUIDE.md`

Key configuration:
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT`

## Credentials
- **Admin Password:** `JM@engcivil`

## Future Enhancements (Backlog)
- Move simulation rates/tables to backend (admin-manageable)
- Email notifications for appointments
- Property search functionality
