#!/bin/bash

green='\e[32m'
blue='\e[34m'
yellow='\e[33m'
red='\e[31m'
reset='\e[0m'

echo -e "${blue}🚀 Starting Installation...${reset}"

echo -e "${yellow}🔄 Updating Packages...${reset}"
apt update && apt upgrade -y

echo -e "${yellow}⚙️ Installing Node.js...${reset}"
apt install nodejs -y

if ! command -v npm &> /dev/null; then
    echo -e "${yellow}⚙️ Installing npm...${reset}"
    apt install npm -y
fi

echo -e "${yellow}📦 Installing Dependencies...${reset}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${green}✅ Installation Complete!${reset}"
else
    echo -e "${red}❌ Installation Failed!${reset}"
    exit 1
fi

echo -e "${blue}🚀 Starting Chatbot...${reset}"
node index.js
