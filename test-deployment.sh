#!/bin/bash

echo "🧪 Testing Football Team Management System Deployment"
echo "====================================================="
echo ""

echo "1. Testing Backend Health..."
curl -s https://football-team-management-tl20.onrender.com/health
echo ""
echo ""

echo "2. Testing Frontend..."
curl -s -I https://footbball.netlify.app | head -1
echo ""

echo "3. Testing API Endpoints..."
echo "   - Health: https://football-team-management-tl20.onrender.com/health"
echo "   - Teams: https://football-team-management-tl20.onrender.com/api/teams"
echo "   - Stats: https://football-team-management-tl20.onrender.com/api/stats/2023"
echo ""

echo "4. Frontend URL: https://footbball.netlify.app"
echo ""

echo "✅ If backend health returns JSON, your deployment is working!"
echo "🚀 If not, check Render logs for MongoDB connection issues."
