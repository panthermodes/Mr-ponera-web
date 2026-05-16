# MR PONERA - Premium Draw Betting Slips Platform

A full-stack web application for draw betting slips with VIP membership system.

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django REST Framework SimpleJWT 5.3.0
- Django CORS Headers 4.3.1
- Django Filter 23.3
- Django Rate Limit 4.1.0
- Pillow 10.1.0 (Image handling)
- Python Decouple 3.8 (Configuration)
- Gunicorn 21.2.0 (Production server)
- WhiteNoise 6.6.0 (Static file serving)

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- Lucide React 0.294.0 (Icons)
- Tailwind CSS 3.3.6
- Vite 5.0.8 (Build tool)

## Features

### User Features
- User registration and authentication with JWT
- Role-based access control (User, VIP, Admin)
- Free betting slips (public access)
- VIP betting slips (paid membership)
- Payment upload for VIP upgrade (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa)
- Payment history tracking
- Mobile-responsive design

### Admin Features
- Admin dashboard
- Create, edit, delete betting slips
- Manage user payments (approve/reject)
- View platform statistics
- User management

## Project Structure

```
MR PONERA WEB/
├── backend/
│   ├── apps/
│   │   ├── authentication/    # User auth & JWT
│   │   ├── payments/          # Payment management
│   │   └── slips/             # Betting slips CRUD
│   ├── mrponera/              # Django project settings
│   ├── manage.py
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── requirements.txt
└── README.md
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r ../requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - Login user
- POST `/api/auth/logout/` - Logout user
- GET `/api/auth/profile/` - Get user profile

### Slips
- GET `/api/slips/free/` - Get free slips (public)
- GET `/api/slips/vip/` - Get VIP slips (VIP only)
- GET `/api/slips/ht/` - Get Half Time slips (VIP only)
- GET `/api/slips/htft/` - Get HT/FT slips (VIP only)
- POST `/api/slips/create/` - Create slip (Admin only)
- PUT `/api/slips/update/<id>/` - Update slip (Admin only)
- DELETE `/api/slips/delete/<id>/` - Delete slip (Admin only)

### Payments
- POST `/api/payments/upload/` - Upload payment proof
- GET `/api/payments/my-payments/` - Get user payments
- GET `/api/payments/pending/` - Get pending payments (Admin only)
- POST `/api/payments/approve/<id>/` - Approve payment (Admin only)
- POST `/api/payments/reject/<id>/` - Reject payment (Admin only)
- GET `/api/payments/stats/` - Get payment statistics (Admin only)

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=mrponeradb
DB_USER=postgres
DB_PASSWORD=MRPONERA123
DB_HOST=localhost
DB_PORT=5432
```

## Payment Networks

The platform supports the following Tanzanian mobile money networks:
- M-Pesa
- Tigo Pesa
- Airtel Money
- HaloPesa

## VIP Membership

The platform offers multiple VIP tiers with different pricing:

- **Sure Draw VIP**: TSh 40,000/month
  - Premium draw betting slips with high accuracy
  
- **Half Time Draw VIP**: TSh 25,000/month
  - Specialized half-time draw predictions with premium accuracy
  
- **HT/FT Draw VIP**: TSh 60,000/month
  - Half-time/Full-time draw combinations for maximum returns
  
- **Daily Sure Fixed Odd**: TSh 20,000/month
  - Daily fixed odds with guaranteed high returns

All VIP memberships are valid for 30 days from payment approval.

## License

This project is proprietary software.
