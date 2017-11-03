#!/bin/bash
echo $'\n'"🌧  Drizzy Deploy 🌧"$'\n'"============================"$'\n'

-read -p 'Enter NewsAPI Auth Token: ' val
export NEWSAPI_PASS=$val
export NODE_ENV='production'
export PORT='6060'
npm install
npm run build
npm start
