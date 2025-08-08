# 🖥️ Local Development Setup

## 🎯 **Goal:**
Test the web app locally while connecting to the real Railway PostgreSQL database.

## 📋 **Prerequisites:**
- Node.js installed
- Git access to the repository
- Railway PostgreSQL database URL

## 🚀 **Setup Steps:**

### **1. Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/rageeth/chitti-healthcare-webapp.git
cd chitti-healthcare-webapp

# Install dependencies
npm install
```

### **2. Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Railway PostgreSQL Database
REACT_APP_API_URL=https://chitti-production.up.railway.app
REACT_APP_ENVIRONMENT=development
NODE_ENV=development

# Optional: Direct database connection (if needed)
# DATABASE_URL=postgresql://username:password@host:port/database
```

### **3. Start Development Server**
```bash
npm start
```

The app will run on `http://localhost:3000`

## 🔧 **Configuration Details:**

### **API Connection:**
- **Local Frontend**: `http://localhost:3000`
- **Remote Backend**: `https://chitti-production.up.railway.app`
- **Database**: Railway PostgreSQL (shared)

### **Benefits:**
- ✅ **Fast development** - no deployment needed
- ✅ **Real data** - connects to production database
- ✅ **Hot reload** - changes reflect immediately
- ✅ **Debugging** - browser dev tools available

## 🧪 **Testing Workflow:**

### **1. Test Registration:**
- Go to `http://localhost:3000/register`
- Fill the form
- Check Railway logs for API calls

### **2. Test Login:**
- Use demo credentials: `demo@hospital.com` / `demo123`
- Or register new hospital and test

### **3. Test Super Admin:**
- Access: `http://localhost:3000/super-admin`
- Review pending registrations
- Approve/reject hospitals

## 🔍 **Debugging:**

### **Browser Console:**
- Open DevTools (F12)
- Check Console tab for logs
- Look for API call details

### **Network Tab:**
- Monitor API requests
- Check response status
- Verify data flow

### **Railway Logs:**
- Check Railway dashboard
- Monitor API endpoints
- Verify database operations

## 🚨 **Common Issues:**

### **CORS Errors:**
- Backend needs to allow localhost:3000
- Check Railway CORS configuration

### **API Connection:**
- Verify `REACT_APP_API_URL` is correct
- Check if backend is running

### **Database Issues:**
- Verify Railway PostgreSQL is active
- Check connection limits

## 📊 **Development vs Production:**

| Feature | Local Development | Production |
|---------|------------------|------------|
| Frontend | `localhost:3000` | Railway URL |
| Backend | Railway | Railway |
| Database | Railway | Railway |
| Hot Reload | ✅ Yes | ❌ No |
| Debugging | ✅ Easy | ❌ Hard |

## 🎯 **Next Steps:**

1. **Test registration flow**
2. **Test login functionality**
3. **Test super admin panel**
4. **Add new features locally**
5. **Deploy when ready**

---

## ** Ready to Develop Locally!**

**This setup gives you the best of both worlds: fast local development with real production data!** 🚀 