# Node.js room booking bot for Termux/Windows/Linux

## 🚀 Installation

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
   node index.js
   ```

## ⚙️ Requirements
- Termux (Android)
- Node.js (installed automatically)

## 🖥️ Windows Installation
1. **Install Node.js:** Download and install from [nodejs.org](https://nodejs.org/).
2. **Open Command Prompt:**
   ```cmd
   git clone <repository_url>
   cd <repository_folder>
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
   git clone <repository_url>
   cd <repository_folder>
   npm install
   node index.js
   ```

## 🛠️ Configuration
1. Create a `config.json` file:
   ```json
   {
     "token": "YOUR_TELEGRAM_BOT_TOKEN",
     "base_URL": "https://your-api-url.com",
     "admins": "YOUR_ADMIN_ID"
   }
   ```

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

