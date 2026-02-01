#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api/auth/register"

# JSON Data
DATA='{
    "name": "Ankit",
    "email": "qrnotes2020@gmail.com",
    "phone": "1478523690",
    "password": "testing",
    "geolocationStateId": "67b9f85c5fc474dc44cee2b9",
    "geolocationDistrictId": "683333091e824be75b1d2a5d",
    "stateName": "Andaman and Nicobar Islands",
    "districtName": "Nicobar",
    "educationLevel": "school",
    "examType": "school",
    "className": "Class 6",
    "courseName": "CBSE",
    "subExamId": "697ee871d0623c850da36723",
    "subExamSlug": "cbse-class-6"
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