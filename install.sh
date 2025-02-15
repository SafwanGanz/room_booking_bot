#!/bin/bash

green='\e[32m'
blue='\e[34m'
yellow='\e[33m'
red='\e[31m'
purple='\e[35m'
cyan='\e[36m'
reset='\e[0m'

print_centered() {
    local text="$1"
    local color="$2"
    local terminal_width=$(tput cols)
    local padding=$(( (terminal_width - ${#text}) / 2 ))
    printf "${color}%${padding}s${text}%${padding}s${reset}\n" "" ""
}


check_requirements() {
    print_centered "🔍 Checking System Requirements..." "$blue"
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        echo -e "${yellow}📱 Operating System: ${NAME} ${VERSION}${reset}"
    fi
    
    
    local total_memory=$(free -m | awk '/^Mem:/{print $2}')
    echo -e "${yellow}💾 Total Memory: ${total_memory}MB${reset}"
    
    if [ $total_memory -lt 512 ]; then
        echo -e "${red}⚠️ Warning: Low memory detected. Minimum 512MB RAM recommended.${reset}"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    local free_space=$(df -h . | awk 'NR==2 {print $4}')
    echo -e "${yellow}💿 Available Disk Space: ${free_space}${reset}"
}

create_backup() {
    print_centered "📦 Creating Backup..." "$purple"
    
    if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
        backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$backup_dir"
        
        if [ -d "node_modules" ]; then
            mv node_modules "$backup_dir/"
        fi
        if [ -f "package-lock.json" ]; then
            mv package-lock.json "$backup_dir/"
        fi
        
        echo -e "${green}✅ Backup created in ${backup_dir}${reset}"
    fi
}


install_dependencies() {
    print_centered "📥 Installing Dependencies..." "$cyan"
    
    local dependencies=("nodejs" "npm" "git" "python3" "ffmpeg")
    
    for dep in "${dependencies[@]}"; do
        echo -e "${yellow}⚙️ Installing ${dep}...${reset}"
        if ! command -v $dep &> /dev/null; then
            apt install $dep -y || {
                echo -e "${red}❌ Failed to install ${dep}${reset}"
                exit 1
            }
        else
            echo -e "${green}✅ ${dep} is already installed${reset}"
        fi
    done
}



DEBUG_MODE=false
LOG_LEVEL=info
EOF
        echo -e "${green}✅ Created .env file${reset}"
        echo -e "${yellow}⚠️ Please update the .env file with your actual credentials${reset}"
    fi
}


install_npm_packages() {
    print_centered "📦 Installing NPM Packages..." "$blue"
    
    echo -e "${yellow}🧹 Cleaning npm cache...${reset}"
    npm cache clean --force
    
    echo -e "${yellow}🔄 Installing packages...${reset}"
    npm install || {
        echo -e "${red}❌ Failed to install NPM packages${reset}"
        exit 1
    }
    
    echo -e "${yellow}📝 Installing dev dependencies...${reset}"
    npm install --save-dev nodemon eslint prettier || {
        echo -e "${red}❌ Failed to install dev dependencies${reset}"
        exit 1
    }
}

setup_pm2() {
    print_centered "🔄 Setting up PM2..." "$cyan"
    
    if ! command -v pm2 &> /dev/null; then
        echo -e "${yellow}⚙️ Installing PM2...${reset}"
        npm install -g pm2 || {
            echo -e "${red}❌ Failed to install PM2${reset}"
            exit 1
        }
    fi
    
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: "chatbot",
    script: "index.js",
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
EOF
}


main() {
    clear
    print_centered "🤖 Chatbot Installation Script" "$blue"
    print_centered "Version 2.0" "$yellow"
    echo
    

    if [ "$EUID" -ne 0 ]; then
        echo -e "${red}❌ Please run as root${reset}"
        exit 1
    }
    
    check_requirements
    create_backup
    
    echo -e "${yellow}🔄 Updating System Packages...${reset}"
    apt update && apt upgrade -y
    
    install_dependencies
    configure_environment
    install_npm_packages
    setup_pm2
    
    print_centered "🎉 Installation Complete!" "$green"
    echo -e "${cyan}To start the bot:${reset}"
    echo -e "${yellow}1. Development mode: ${green}npm run dev${reset}"
    echo -e "${yellow}2. Production mode: ${green}pm2 start ecosystem.config.js${reset}"
    echo -e "${yellow}3. View logs: ${green}pm2 logs chatbot${reset}"
    echo
    echo -e "${cyan}To stop the bot:${reset}"
    echo -e "${yellow}1. Development mode: ${green}Ctrl+C${reset}"
    echo -e "${yellow}2. Production mode: ${green}pm2 stop chatbot${reset}"
    
    read -p "Would you like to start the bot now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_centered "🚀 Starting bot..." "$blue"
        pm2 start ecosystem.config.js
        pm2 logs chatbot
    fi
}
main
