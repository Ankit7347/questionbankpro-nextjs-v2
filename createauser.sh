#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api/auth/register"

# JSON Data
DATA='{
    "className": "pg",
    "competition": "postgraduate-programs",
    "courseName": "tt",
    "districtName": "Anakapalli",
    "email": "qrnotes2021@gmail.com",
    "name": "Ankit",
    "otherCourse": "tt",
    "password": "testing",
    "phone": "1478523690",
    "stateName": "Andhra Pradesh"
}'

echo "🚀 Sending registration request to $API_URL..."

# Execute Curl Request
response=$(curl -s -w "\nStatus code: %{http_code}\n" \
     -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$DATA")

echo "--------------------------"
echo "$response"
echo "--------------------------"