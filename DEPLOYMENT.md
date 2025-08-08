# 🚀 Healthcare Web App Deployment Guide

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Railway account (for deployment)
- GitHub repository connected

## 🔧 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## 🚀 Railway Deployment

### 1. Connect to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your healthcare-webapp repository

### 2. Configure Environment Variables

Add these environment variables in Railway dashboard:

```env
REACT_APP_API_URL=https://chitti-production.up.railway.app
REACT_APP_ENVIRONMENT=production
NODE_ENV=production
```

### 3. Build Configuration

Railway will automatically detect this is a React app and build it. The build command is:

```bash
npm run build
```

### 4. Start Command

Set the start command to:

```bash
npx serve -s build -l $PORT
```

### 5. Domain Configuration

Railway will provide a custom domain. You can also add a custom domain:

1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records

## 🔗 Backend Integration

### API Endpoints

The web app connects to these backend endpoints:

- **Base URL**: `https://chitti-production.up.railway.app`
- **Login**: `POST /healthcare/admin/login`
- **Registration**: `POST /healthcare/provider/register`
- **Dashboard**: `GET /healthcare/provider/:id/dashboard`
- **Doctors**: `POST /healthcare/doctor/add`
- **Appointments**: `PUT /healthcare/appointment/:id/status`

### CORS Configuration

Ensure the backend has CORS configured for your web app domain:

```javascript
app.use(cors({
  origin: ['https://your-webapp-domain.railway.app', 'http://localhost:3000'],
  credentials: true
}));
```

## 📊 Database Setup

### 1. Run Healthcare Schema

Execute the healthcare schema on your PostgreSQL database:

```sql
-- Run healthcare_schema.sql
-- This creates all necessary tables for healthcare providers
```

### 2. Verify Tables

Check that these tables exist:
- `healthcare_providers`
- `doctors`
- `appointments`
- `doctor_availability`
- `healthcare_admins`
- `specializations`

## 🔒 Security Configuration

### 1. Environment Variables

Never commit sensitive data. Use Railway's environment variables:

- `JWT_SECRET`: Your JWT secret key
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key

### 2. HTTPS

Railway automatically provides HTTPS certificates.

### 3. CORS

Configure CORS to only allow your domains:

```javascript
const allowedOrigins = [
  'https://your-webapp-domain.railway.app',
  'http://localhost:3000'
];
```

## 📱 Testing

### 1. Demo Credentials

Use these credentials for testing:

```
Email: demo@hospital.com
Password: demo123
```

### 2. Test Scenarios

1. **Provider Registration**
   - Register a new healthcare facility
   - Verify email and phone validation

2. **Doctor Management**
   - Add new doctors
   - Set consultation fees
   - Manage specializations

3. **Appointment Management**
   - View appointments
   - Confirm/cancel appointments
   - Update status

4. **Availability Management**
   - Set weekly schedules
   - Configure time slots
   - Save availability

## 🔄 Continuous Deployment

### 1. GitHub Integration

Railway automatically deploys on every push to main branch.

### 2. Branch Strategy

- `main`: Production deployment
- `develop`: Staging deployment
- `feature/*`: Feature branches

### 3. Deployment Pipeline

1. Push code to GitHub
2. Railway detects changes
3. Runs `npm install`
4. Runs `npm run build`
5. Deploys to production

## 📈 Monitoring

### 1. Railway Dashboard

Monitor your deployment in Railway dashboard:
- Build logs
- Runtime logs
- Performance metrics
- Error tracking

### 2. Health Checks

The app includes health check endpoints:
- `/health`: Basic health check
- `/api/status`: API status

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify all dependencies installed
   - Check for syntax errors

2. **API Connection Issues**
   - Verify backend URL
   - Check CORS configuration
   - Test API endpoints directly

3. **Database Issues**
   - Verify database connection
   - Check schema is applied
   - Test database queries

### Debug Commands

```bash
# Check build output
npm run build

# Test API connection
curl https://your-backend-url.com/health

# Check environment variables
echo $REACT_APP_API_URL
```

## 📞 Support

For deployment issues:

1. Check Railway logs
2. Verify environment variables
3. Test locally first
4. Contact support if needed

---

**🚀 Your Healthcare Web App is now ready for deployment!** 