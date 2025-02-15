# Node.js room booking bot for Termux/Windows/Linux

## 🚀 Installation On Termux

1. **Clone the Repository:**
   ```bash
   git clone https://github.con/SafwanGanz/room_booking_bot
   cd room_booking_bot
   ```

2. **Run the Installation Script:**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Start the Bot:**
   ```bash
   npm start
   ```

## ⚙️ Requirements
- Termux (Android)
- Node.js (installed automatically)

## 🖥️ Windows Installation
1. **Install Node.js:** Download and install from [nodejs.org](https://nodejs.org/).
2. **Open Command Prompt:**
   ```cmd
   git clone https://github.con/SafwanGanz/room_booking_bot
   cd room_booking_bot
   npm install
   node index.js
   ```

## 🐧 Linux Installation
1. **Install Node.js:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm git -y
   ```
2. **Clone and Start:**
   ```bash
   git clone https://github.con/SafwanGanz/room_booking_bot
   cd room_booking_bot
   npm install
   node index.js
   ```

## 🛠️ Configuration

1. Edit the `config.json` file:

    ```json
    {
      "port": 3000,
      "mongo": "",
      "token": "",
      "base_URL": "http://localhost:3000",
      "admins": ""
    }
    ```

    - **port**: The port on which your application will run.  
    - **mongo**: MongoDB connection string (from MongoDB Atlas or local instance).  
    - **token**: Bot token obtained from BotFather on Telegram.  
    - **base_URL**: Base URL of your application (change to your domain if hosted online).  
    - **admins**: Comma-separated list of admin user IDs with special privileges.  


2. Replace the placeholders with your actual details.

## 🧩 Features
- User registration and room booking
- Admin panel for managing rooms and users
- Feedback collection and management

## 🔧 Commands
- `/start` - Start the bot
- `/register` - Register as a user
- `/search` - Search available rooms
- `/book` - Book a room
- `/mybookings` - View user bookings
- `/help` - Display help menu
- `/admin` - Access admin panel (admin only)
- `/feedback` - Submit feedback
- `/view_feedback` - View feedback (admin only)

## 🛠️ Admin Actions
- Add, view, and remove rooms
- View and manage users
- Monitor bookings
- Manage feedback

## 🌐 API Endpoints
Ensure the following API endpoints are available:
- `POST /api/register` - Register new user
- `GET /api/rooms` - Fetch available rooms
- `POST /api/bookings` - Book a room
- `GET /api/bookings/user/:id` - Get user's bookings
- `GET /api/admin/users` - Admin view all users
- `POST /api/admin/room` - Admin add room
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - View feedback

## 🌟 Usage Tips
- Run the bot in the background using `tmux` or `screen`.
- Update dependencies regularly.
- Secure your `config.json` file.

## 🚑 Troubleshooting
- **Bot not starting:** Ensure `config.json` is correctly set up.
- **Command not recognized:** Update the bot or recheck commands.
- **API errors:** Verify the backend server and API endpoints.

Enjoy your chatbot! 🤖🎉

