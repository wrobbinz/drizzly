#!/bin/bash
echo $'\n'"🌧  Drizzy Deploy 🌧"$'\n'"============================"$'\n'

-read -p "Enter NewsAPI Auth Token: " val
export NEWSAPI_PASS=$val

npm install
npm start
