# 🚀 Render Environment Variables Setup

## 📋 **Copy and Paste These Environment Variables**

Go to your Render dashboard: https://dashboard.render.com/
Click on your service: `football-team-management-tl20`
Go to **"Environment"** tab
Add these variables:

### **Variable 1: MONGODB_URI**
```
mongodb+srv://daniyalareeb786_db_user:1cnTWx9jmqTFCUaX@football.1hthjaa.mongodb.net/Footballdb?retryWrites=true&w=majority
```

### **Variable 2: NODE_ENV**
```
production
```

### **Variable 3: FRONTEND_URL**
```
https://footbball.netlify.app
```

## 🔄 **After Adding Variables**

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait for deployment to complete
4. Test your backend: https://football-team-management-tl20.onrender.com/health

## ✅ **Expected Result**

Your backend should now:
- Connect to MongoDB Atlas successfully
- Start without errors
- Work with your frontend

## 🎯 **Test Your Complete Application**

- **Frontend**: https://footbball.netlify.app
- **Backend**: https://football-team-management-tl20.onrender.com
- **Health Check**: https://football-team-management-tl20.onrender.com/health

---

**Your Football Team Management System will be fully live! 🚀⚽**
