# 🏨 Room Booking Bot

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)

A powerful Telegram bot for managing room bookings, built with Node.js. Perfect for hotels, hostels, and property managers.

## 📑 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [Termux (Android)](#android-termux-installation)
  - [Windows](#windows-installation)
  - [Linux](#linux-installation)
- [Configuration](#-configuration)
- [Commands](#-available-commands)
- [Admin Panel](#-admin-panel)
- [API Documentation](#-api-documentation)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🌟 Features

- **User Management**
  - Seamless registration process
  - Profile management
  - Booking history tracking

- **Booking System**
  - Real-time room availability
  - Instant booking confirmation
  - Automated reminders
  - Booking modification options

- **Admin Controls**
  - Comprehensive dashboard
  - User management
  - Room inventory control
  - Booking oversight
  - Analytics and reporting

- **Additional Features**
  - Multi-language support
  - Feedback system
  - Rating mechanism
  - Payment integration readiness

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Telegram Bot Token
- Internet connection
- Git (for installation)

## 🚀 Installation

### Android (Termux) Installation

```bash
# Update packages
pkg update && pkg upgrade

# Install required packages
pkg install git nodejs

# Clone repository
git clone https://github.com/SafwanGanz/room_booking_bot
cd room_booking_bot

# Install dependencies
npm install

# Run the bot
npm start
```

### Windows Installation

1. **Prepare Your System**
   - Install [Node.js](https://nodejs.org/) (LTS version recommended)
   - Install [Git](https://git-scm.com/downloads)

2. **Installation Steps**
   ```cmd
   # Clone the repository
   git clone https://github.com/SafwanGanz/room_booking_bot
   cd room_booking_bot

   # Install dependencies
   npm install

   # Start the bot
   npm start
   ```

### Linux Installation

```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Install Node.js and npm
sudo apt install nodejs npm

# Clone the repository
git clone https://github.com/SafwanGanz/room_booking_bot
cd room_booking_bot

# Install dependencies
npm install

# Start the bot
npm start
```

## ⚙️ Configuration

Create a `config.json` file in the root directory:

```json
{
  "port": 3000,
  "mongo": "mongodb://your-mongodb-uri",
  "token": "your-telegram-bot-token",
  "base_URL": "http://your-domain.com",
  "admins": "123456789,987654321"
}
```

### Configuration Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| port | Application port | 3000 |
| mongo | MongoDB connection string | mongodb://localhost:27017/booking |
| token | Telegram bot token | 123456789:ABCdefGHIjklMNOpqrsTUVwxyz |
| base_URL | Application base URL | http://yourdomain.com |
| admins | Admin user IDs (comma-separated) | 123456789,987654321 |

## 🤖 Available Commands

### User Commands
| Command | Description |
|---------|-------------|
| `/start` | Initialize the bot |
| `/register` | Create new account |
| `/search` | Find available rooms |
| `/book` | Make a booking |
| `/mybookings` | View your bookings |
| `/help` | Get help information |
| `/feedback` | Submit feedback |

### Admin Commands
| Command | Description |
|---------|-------------|
| `/admin` | Access admin panel |
| `/stats` | View statistics |
| `/broadcast` | Send mass message |
| `/view_feedback` | Check user feedback |

## 🎛️ Admin Panel

The admin panel provides comprehensive management tools:

- **User Management**
  - View user profiles
  - Manage permissions
  - Handle user reports

- **Room Management**
  - Add/remove rooms
  - Update room status
  - Set pricing
  - Manage amenities

- **Booking Oversight**
  - View all bookings
  - Handle cancellations
  - Resolve conflicts
  - Generate reports

## 📡 API Documentation

### Base URL
```
http://your-domain.com/api/v1
```

### Endpoints

#### Authentication
```http
POST /api/register
POST /api/login
```

#### Rooms
```http
GET /api/rooms
GET /api/rooms/:id
POST /api/rooms
PUT /api/rooms/:id
DELETE /api/rooms/:id
```

#### Bookings
```http
POST /api/bookings
GET /api/bookings/user/:id
PUT /api/bookings/:id
DELETE /api/bookings/:id
```

## 💡 Best Practices

1. **Security**
   - Regularly update dependencies
   - Use environment variables
   - Implement rate limiting
   - Enable error logging

2. **Performance**
   - Enable caching
   - Optimize database queries
   - Use connection pooling
   - Implement lazy loading

3. **Maintenance**
   - Regular backups
   - Monitor system resources
   - Keep logs rotated
   - Schedule updates

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Bot Not Responding**
   ```bash
   # Check bot status
   pm2 status

   # View logs
   pm2 logs booking-bot
   ```

2. **Database Connection Issues**
   - Verify MongoDB service is running
   - Check connection string
   - Ensure network connectivity

3. **API Errors**
   - Validate API endpoints
   - Check server logs
   - Verify request format

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Made with ❤️ by [SafwanGanz](https://github.com/SafwanGanz)
