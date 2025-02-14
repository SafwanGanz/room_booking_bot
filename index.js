const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const bot = new Telegraf("7610787226:AAGAGilLAhXPjYGy0t17CEGoNJ-GsEWUVNw");
const BASE_URL = "http://localhost:3000";

bot.use(session());

bot.use((ctx, next) => {
    ctx.session ??= {
        step: null,
        bookingData: null,
        roomData: {
            location: {},
            amenities: []
        },
        userData: {
            name: '',
            age: 0,
            phone: '',
            email: '',
            address: '',
            stayDuration: 0
        }
    };
    return next();
});

const formatUserData = (user) => {
    try {
        return {
            name: user.name || 'N/A',
            age: user.age || 0,
            phone: user.phone || 'N/A',
            email: user.email || 'N/A',
            address: user.address || 'N/A',
            stayDuration: user.stayDuration || 0
        };
    } catch (error) {
        return {
            name: 'N/A',
            age: 0,
            phone: 'N/A',
            email: 'N/A',
            address: 'N/A',
            stayDuration: 0
        };
    }
};

const formatRoomData = (room) => {
    try {
        return {
            roomNumber: room.roomNumber || 'N/A',
            type: room.type || 'N/A',
            price: room.price || 0,
            location: {
                building: room.location?.building || 'N/A',
                floor: room.location?.floor || 'N/A',
                landmark: room.location?.landmark || 'N/A',
                address: room.location?.address || 'N/A'
            },
            amenities: Array.isArray(room.amenities) ? room.amenities : []
        };
    } catch (error) {
        return {
            roomNumber: 'N/A',
            type: 'N/A',
            price: 0,
            location: {
                building: 'N/A',
                floor: 'N/A',
                landmark: 'N/A',
                address: 'N/A'
            },
            amenities: []
        };
    }
};

const formatRoomMessage = (room) => {
    const formattedRoom = formatRoomData(room);
    return `Room Number: ${formattedRoom.roomNumber}\n` +
        `Type: ${formattedRoom.type}\n` +
        `Price: ₹${formattedRoom.price}\n` +
        `Location: ${formattedRoom.location.building}, Floor ${formattedRoom.location.floor}\n` +
        `Amenities: ${formattedRoom.amenities.join(', ') || 'None'}\n\n`;
};

bot.command('start', ctx => {
    if (ctx.from.id.toString() === "1954643338") {
        return ctx.reply(
            '👋 Welcome to the Room Booking Bot!\n\n' +
            'This is the Admin Panel. What would you like to do?\n\n' +
            'Here are some commands you can use:\n' +
            '/search - Search for available rooms\n' +
            '/book - Book a room\n' +
            '/mybookings - View your bookings\n' +
            '/help - Get help\n\n' +
            '🔑 Admin Commands:\n' +
            '/admin - Access Admin Panel'
        );
    } else {
        return ctx.reply(
            '👋 Welcome to the Room Booking Bot!\n\n' +
            'Here are some commands you can use:\n' +
            '/register - Register as a new user\n' +
            '/search - Search for available rooms\n' +
            '/book - Book a room\n' +
            '/mybookings - View your bookings\n' +
            '/help - Get help'
        );
    }
});

bot.command('register', ctx => {
    ctx.sendPhoto("https://i.ibb.co/Kj12wVhV/Screenshot-27.jpg", { caption: "📝 Register New User" });
    ctx.session.step = 'register_name';
    ctx.session.userData = {
        name: '',
        age: 0,
        phone: '',
        email: '',
        address: '',
        stayDuration: 0
    };
    return ctx.reply('Please enter your full name:');
});

bot.command('help', ctx => {
    if (ctx.from.id.toString() === "1954643338") {
        return ctx.reply(
            '🤖 Bot Commands:\n\n' +
            '/start - Start the bot\n' +
            '/search - Search for available rooms\n' +
            '/book - Book a room\n' +
            '/mybookings - View your bookings\n' +
            '/help - Get help\n' +
            '/admin - Access Admin Panel'
        );
    } else {
        return ctx.reply(
            '🤖 Bot Commands:\n\n' +
            '/start - Start the bot\n' +
            '/register - Register as a new user\n' +
            '/search - Search for available rooms\n' +
            '/book - Book a room\n' +
            '/mybookings - View your bookings\n' +
            '/help - Get help'
        );
    }
});

bot.command('admin', ctx => {
    if (ctx.from.id.toString() !== "1954643338") {
        return ctx.reply('❌ Unauthorized');
    }
    return ctx.replyWithPhoto(
        'https://i.ibb.co/QFhYM45y/Screenshot-2025-02-14-015235.png',
        {
            caption: '🔑 Admin Panel',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➕ Add Room', callback_data: 'add_room' }],
                    [{ text: '🏨 View Rooms', callback_data: 'view_rooms' }],
                    [{ text: '👥 Users', callback_data: 'manage_users' }]
                ]
            }
        }
    );
});

bot.action('add_room', async ctx => {
    await ctx.deleteMessage();
    ctx.session.step = 'add_room_number';
    ctx.session.roomData = {
        location: {},
        amenities: []
    };
    return ctx.reply('Room number:');
});

bot.action('view_rooms', async ctx => {
    try {
        const response = await axios.get(`${BASE_URL}/api/rooms`);
        const rooms = response.data;

        if (!Array.isArray(rooms) || rooms.length === 0) {
            return ctx.reply('No rooms available at the moment.');
        }

        let message = '🏨 Available Rooms:\n\n';
        rooms.forEach(room => {
            message += formatRoomMessage(room);
        });

        return ctx.reply(message);
    } catch (err) {
        return ctx.reply('❌ Error fetching rooms. Please try again later.');
    }
});

bot.action('manage_users', async ctx => {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/users`);
        const users = response.data;

        if (!Array.isArray(users) || users.length === 0) {
            return ctx.reply('No registered users found.');
        }

        let message = '👥 Registered Users:\n\n';
        users.forEach(user => {
            const userData = formatUserData(user);
            message += `Name: ${userData.name}\n` +
                `Age: ${userData.age}\n` +
                `Phone: ${userData.phone}\n` +
                `Email: ${userData.email}\n` +
                `Stay Duration: ${userData.stayDuration} months\n\n`;
        });

        return ctx.reply(message);
    } catch (err) {
        return ctx.reply('❌ Error fetching users. Please try again later.');
    }
});

bot.command('search', async ctx => {
    try {
        const response = await axios.get(`${BASE_URL}/api/rooms`);
        const rooms = response.data;

        if (!Array.isArray(rooms) || rooms.length === 0) {
            return ctx.reply('No rooms available at the moment.');
        }

        let message = '🏨 Available Rooms:\n\n';
        rooms.forEach(room => {
            message += formatRoomMessage(room);
        });

        return ctx.reply(message);
    } catch (err) {
        return ctx.reply('❌ Error fetching rooms. Please try again later.');
    }
});

bot.command('book', ctx => {
    ctx.session.step = 'book_room_number';
    return ctx.reply('Enter the room number you want to book:');
});

bot.command('sendphotos', (ctx) => {
    const mediaGroup = [
        { type: 'photo', media: 'https://i.ibb.co/QFhYM45y/Screenshot-2025-02-14-015235.png', caption: '🔑 Admin Panel' },
        { type: 'photo', media: 'https://i.ibb.co/Kj12wVhV/Screenshot-27.jpg' }
    ];

    ctx.replyWithMediaGroup(mediaGroup);
});

bot.command('mybookings', async ctx => {
    try {
        const userId = ctx.from.id;
        const response = await axios.get(`${BASE_URL}/api/bookings/user/${userId}`);
        const bookings = response.data;

        if (!Array.isArray(bookings) || bookings.length === 0) {
            return ctx.reply('You have no bookings.');
        }

        let message = '📅 Your Bookings:\n\n';
        bookings.forEach(booking => {
            message += formatRoomMessage(booking);
        });

        return ctx.reply(message);
    } catch (err) {
        return ctx.reply('❌ Error fetching your bookings. Please try again later.');
    }
});

const admins = [1954643338];

bot.use((ctx, next) => {
    if (ctx.from && admins.includes(ctx.from.id)) {
        return next();
    } else {
        return ctx.reply('❌ Access denied! Admins only.');
    }
});

bot.on('photo', async (ctx) => {
    if (ctx.session.step !== 'add_room_photos') {
        return ctx.reply('Please follow the steps correctly. Enter room details first.');
    }

    const photo = ctx.message.photo.pop();
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);

    const filePath = `./uploads/${photo.file_id}.jpg`;
    const response = await axios({ url: fileLink, responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(filePath));

    ctx.session.roomData.images = ctx.session.roomData.images || [];
    ctx.session.roomData.images.push(filePath);

    ctx.reply('📸 Photo added! Send more or type /done when finished.');
});

bot.command('done', async (ctx) => {
    if (ctx.session.step !== 'add_room_photos') return;

    const roomData = ctx.session.roomData;
    if (!roomData.images || roomData.images.length === 0) {
        return ctx.reply('No photos uploaded. Please send at least one photo.');
    }

    const formData = new FormData();
    roomData.images.forEach((imgPath) => {
        formData.append('images', fs.createReadStream(imgPath));
    });

    try {
        const response = await axios.post(`${BASE_URL}/api/admin/room/photos`, formData, {
            headers: formData.getHeaders()
        });

        ctx.session.roomData.imageUrls = response.data.imageUrls;
        ctx.session.step = 'add_room_number';
        ctx.reply('✅ Photos uploaded successfully! Now enter the room number:');
    } catch (error) {
        ctx.reply('❌ Failed to upload photos: ' + error.message);
    }
});

bot.on('text', async ctx => {
    try {
        switch (ctx.session.step) {
            case 'register_name':
                if (!ctx.message.text.trim() || ctx.message.text.length < 3) {
                    return ctx.reply('Please enter a valid name (at least 3 characters).');
                }
                ctx.session.userData.name = ctx.message.text.trim();
                ctx.session.step = 'register_age';
                return ctx.reply('Please enter your age:');

            case 'register_age':
                const age = parseInt(ctx.message.text);
                if (isNaN(age) || age < 18 || age > 100) {
                    return ctx.reply('Please enter a valid age (18-100).');
                }
                ctx.session.userData.age = age;
                ctx.session.step = 'register_phone';
                return ctx.reply('Please enter your phone number:');

            case 'register_phone':
                const phone = ctx.message.text.trim();
                if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
                    return ctx.reply('Please enter a valid phone number (at least 10 digits).');
                }
                ctx.session.userData.phone = phone;
                ctx.session.step = 'register_email';
                return ctx.reply('Please enter your email address:');

            case 'register_email':
                const email = ctx.message.text.trim().toLowerCase();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return ctx.reply('Please enter a valid email address.');
                }
                ctx.session.userData.email = email;
                ctx.session.step = 'register_address';
                return ctx.reply('Please enter your current address:');

            case 'register_address':
                if (!ctx.message.text.trim() || ctx.message.text.length < 10) {
                    return ctx.reply('Please enter a valid address (at least 10 characters).');
                }
                ctx.session.userData.address = ctx.message.text.trim();
                ctx.session.step = 'register_stayDuration';
                return ctx.reply('Please enter your intended stay duration (in months):');

            case 'register_stayDuration':
                const duration = parseInt(ctx.message.text);
                if (isNaN(duration) || duration < 1 || duration > 24) {
                    return ctx.reply('Please enter a valid duration (1-24 months).');
                }
                ctx.session.userData.stayDuration = duration;
                ctx.session.step = null;

                try {
                    const userData = {
                        ...ctx.session.userData,
                        userId: ctx.from.id
                    };

                    const response = await axios.post(`${BASE_URL}/api/register`, userData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    
                    const registeredUser = response.data.user;

              
                    const formattedUserData = formatUserData(registeredUser);

                    return ctx.reply(
                        '✅ Registration successful!\n\n' +
                        `Name: ${formattedUserData.name}\n` +
                        `Age: ${formattedUserData.age}\n` +
                        `Phone: ${formattedUserData.phone}\n` +
                        `Email: ${formattedUserData.email}\n` +
                        `Address: ${formattedUserData.address}\n` +
                        `Stay Duration: ${formattedUserData.stayDuration} months\n\n` +
                        'You can now use /book to book a room!'
                    );
                } catch (err) {
                    console.error('Registration Error:', err.response?.data || err.message);
                    return ctx.reply('❌ Registration failed. Please try again later.');
                }
            case 'add_room_number':
                if (!ctx.message.text.trim()) {
                    return ctx.reply('Please enter a valid room number.');
                }
                ctx.session.roomData.roomNumber = ctx.message.text.trim();
                ctx.session.step = 'add_room_type';
                return ctx.reply('Room type:',
                    Markup.keyboard([['Single', 'Double', 'Shared']])
                        .oneTime()
                        .resize()
                );

            case 'add_room_type':
                if (!['Single', 'Double', 'Shared'].includes(ctx.message.text)) {
                    return ctx.reply('Please select a valid room type.');
                }
                ctx.session.roomData.type = ctx.message.text;
                ctx.session.step = 'add_room_price';
                return ctx.reply('Monthly price (numbers only):');

            case 'add_room_price':
                const price = parseInt(ctx.message.text);
                if (isNaN(price) || price <= 0) {
                    return ctx.reply('Please enter a valid positive number for price.');
                }
                ctx.session.roomData.price = price;
                ctx.session.step = 'add_room_location';
                return ctx.reply('Enter location details in format:\nBuilding, Floor, Landmark, Address');

            case 'add_room_location':
                const locationParts = ctx.message.text.split(',').map(item => item.trim());
                if (locationParts.length < 4) {
                    return ctx.reply('Please provide all location details in the correct format.');
                }
                const [building, floor, landmark, ...addressParts] = locationParts;
                ctx.session.roomData.location = {
                    building: building || 'N/A',
                    floor: parseInt(floor) || 1,
                    landmark: landmark || 'N/A',
                    address: addressParts.join(', ') || 'N/A'
                };
                ctx.session.step = 'add_room_amenities';
                return ctx.reply('Enter amenities separated by commas (e.g., WiFi, AC, Geyser):');

            case 'add_room_amenities':
                const amenities = ctx.message.text.split(',').map(item => item.trim()).filter(item => item);
                if (amenities.length === 0) {
                    return ctx.reply('Please enter at least one amenity.');
                }
                ctx.session.roomData.amenities = amenities;
                ctx.session.step = null;

                try {
                    const formData = new FormData();
                    formData.append('roomNumber', ctx.session.roomData.roomNumber);
                    formData.append('type', ctx.session.roomData.type);
                    formData.append('price', ctx.session.roomData.price);
                    formData.append('location', JSON.stringify(ctx.session.roomData.location));
                    formData.append('amenities', JSON.stringify(ctx.session.roomData.amenities));

                    const response = await axios.post(`${BASE_URL}/api/admin/room`, formData, {
                        headers: {
                            ...formData.getHeaders()
                        }
                    });

                    return ctx.reply(
                        '✅ Room added successfully!\n\n' +
                        formatRoomMessage(response.data)
                    );
                } catch (err) {
                    return ctx.reply('❌ Error adding room. Please try again later.');
                }

            case 'book_room_number':
                const roomNumber = ctx.message.text.trim();
                if (!roomNumber) {
                    return ctx.reply('Please enter a valid room number.');
                }

                try {
                    const checkUserResponse = await axios.get(`${BASE_URL}/api/users/${ctx.from.id}`);
                    if (!checkUserResponse.data) {
                        return ctx.reply('❌ Please register first using /register command before booking a room.');
                    }

                    const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, {
                        userId: ctx.from.id,
                        roomNumber: roomNumber,
                        userData: checkUserResponse.data
                    });

                    if (bookingResponse.data.status === 'success') {
                        return ctx.reply(
                            `✅ Room ${roomNumber} booked successfully!\n\n` +
                            'Use /mybookings to view your booking details.'
                        );
                    } else {
                        return ctx.reply('❌ Room booking failed. ' + (bookingResponse.data.message || 'Please try again.'));
                    }
                } catch (err) {
                    if (err.response?.status === 404) {
                        return ctx.reply('❌ Room not found or not available.');
                    } else if (err.response?.status === 401) {
                        return ctx.reply('❌ Please register first using /register command.');
                    } else if (err.response?.status === 409) {
                        return ctx.reply('❌ Room is already booked.');
                    } else {
                        return ctx.reply('❌ Error booking room. Please try again later.');
                    }
                }
                break;

            case 'view_user_details':
                try {
                    const userId = ctx.message.text.trim();
                    if (!userId) {
                        return ctx.reply('Please enter a valid user ID.');
                    }

                    const response = await axios.get(`${BASE_URL}/api/admin/users/${userId}`);
                    const userData = formatUserData(response.data);

                    return ctx.reply(
                        `👤 User Details:\n\n` +
                        `Name: ${userData.name}\n` +
                        `Age: ${userData.age}\n` +
                        `Phone: ${userData.phone}\n` +
                        `Email: ${userData.email}\n` +
                        `Address: ${userData.address}\n` +
                        `Stay Duration: ${userData.stayDuration} months\n\n` +
                        `Bookings: ${response.data.bookings?.length || 0}`
                    );
                } catch (err) {
                    return ctx.reply('❌ Error fetching user details. Please try again later.');
                }
                break;
        }
    } catch (err) {
        ctx.session.step = null;
        return ctx.reply('❌ An error occurred. Please try again.');
    }
});


bot.action('manage_users', async ctx => {
    if (ctx.from.id.toString() !== "1954643338") {
        return ctx.reply('❌ Unauthorized');
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/admin/users`);
        const users = response.data;

        if (!Array.isArray(users) || users.length === 0) {
            return ctx.reply('No registered users found.');
        }

        let message = '👥 Registered Users:\n\n';
        users.forEach(user => {
            const userData = formatUserData(user);
            message += `ID: ${user.userId}\n` +
                      `Name: ${userData.name}\n` +
                      `Phone: ${userData.phone}\n` +
                      `Email: ${userData.email}\n` +
                      `Status: ${user.bookings?.length ? '🏠 Has Booking' : '🔍 Looking'}\n\n`;
        });

        await ctx.reply(message);
        return ctx.reply(
            'Select an action:',
            Markup.inlineKeyboard([
                [{ text: '👤 View User Details', callback_data: 'view_user' }],
                [{ text: '❌ Remove User', callback_data: 'remove_user' }]
            ])
        );
    } catch (err) {
        return ctx.reply('❌ Error fetching users. Please try again later.');
    }
});


bot.action('view_user', ctx => {
    ctx.session.step = 'view_user_details';
    return ctx.reply('Enter user ID to view details:');
});

bot.action('remove_user', async ctx => {
    if (ctx.from.id.toString() !== "1954643338") {
        return ctx.reply('❌ Unauthorized');
    }
    ctx.session.step = 'remove_user';
    return ctx.reply('Enter user ID to remove:');
});


bot.on('text', async ctx => {
    try {
        switch (ctx.session.step) {
            case 'view_user_details':
                const userId = ctx.message.text.trim();
                if (!userId) {
                    return ctx.reply('Please enter a valid user ID.');
                }

                try {
                    const response = await axios.get(`${BASE_URL}/api/admin/users/${userId}`);
                    const userData = formatUserData(response.data);

                    return ctx.reply(
                        `👤 User Details:\n\n` +
                        `Name: ${userData.name}\n` +
                        `Age: ${userData.age}\n` +
                        `Phone: ${userData.phone}\n` +
                        `Email: ${userData.email}\n` +
                        `Address: ${userData.address}\n` +
                        `Stay Duration: ${userData.stayDuration} months\n\n` +
                        `Bookings: ${response.data.bookings?.length || 0}`
                    );
                } catch (err) {
                    return ctx.reply('❌ Error fetching user details. Please try again later.');
                }
                break;

            case 'remove_user':
                const userIdToRemove = ctx.message.text.trim();
                if (!userIdToRemove) {
                    return ctx.reply('Please enter a valid user ID.');
                }

                try {
                    const response = await axios.delete(`${BASE_URL}/api/admin/users/${userIdToRemove}`);
                    return ctx.reply(`✅ User ${userIdToRemove} removed successfully.`);
                } catch (err) {
                    return ctx.reply('❌ Error removing user. Please try again later.');
                }
                break;
        }
    } catch (err) {
        ctx.session.step = null;
        return ctx.reply('❌ An error occurred. Please try again.');
    }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch()
    .then(() => console.log('Bot started successfully'))
    .catch(err => {
        console.error('Error starting bot:', err);
        process.exit(1);
    });