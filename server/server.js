const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const {mongo} = require("../config.json")
const app = express()
app.use(express.json())

mongoose.connect(mongo, {})

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    stayDuration: { type: Number, required: true },
    userId: { type: Number, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
})

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    location: {
        building: String,
        floor: Number,
        landmark: String,
        address: String
    },
    amenities: [String],
    isOccupied: { type: Boolean, default: false },
    currentOccupant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
})

const feedbackSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Feedback = mongoose.model('Feedback', feedbackSchema)

const User = mongoose.model('User', userSchema)
const Room = mongoose.model('Room', roomSchema)
const Admin = mongoose.model('Admin', adminSchema)

app.post('/api/admin/room', upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files.map(file => file.path)
        const room = new Room({
            ...req.body,
            images: imagePaths
        })
        await room.save()
        res.status(201).json(room)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.post('/api/admin/room/photos', upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files.map(file => file.path)
        res.status(201).json({ imageUrls: imagePaths })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find().populate('currentOccupant')
        res.json(rooms)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, roomNumber } = req.body

        const occupantId = new mongoose.Types.ObjectId(userId)

        const room = await Room.findOne({ roomNumber })
        if (!room) {
            return res.status(404).json({ error: 'Room not found' })
        }

        if (room.isOccupied) {
            return res.status(400).json({ error: 'Room is already occupied' })
        }

        room.isOccupied = true
        room.currentOccupant = occupantId
        await room.save()

        res.json({ message: 'Room booked successfully', room })
    } catch (error) {
        console.error('Booking Error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const rooms = await Room.find({ currentOccupant: userId })
        res.json(rooms)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.post('/api/register', async (req, res) => {
    const { name, age, phone, email, address, stayDuration, userId } = req.body
  
    if (!name || !age || !phone || !email || !address || !stayDuration || !userId) {
      return res.status(400).json({ error: 'All fields are required' })
    }
  
    try {
      const newUser = new User({ name, age, phone, email, address, stayDuration, userId })
      await newUser.save()
      res.status(201).json({ message: 'User registered successfully', user: newUser })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.get('/api/admin/users/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.delete('/api/admin/users/:userId', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userId: req.params.userId })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await Room.find({ isOccupied: true }).populate('currentOccupant')
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.get('/api/admin/bookings/:status', async (req, res) => {
    try {
        const status = req.params.status
        let query = {}

        switch (status) {
            case 'pending':
                query = { status: 'pending' }
                break
            case 'completed':
                query = { status: 'completed' }
                break
            case 'cancelled':
                query = { status: 'cancelled' }
                break
            default:
                return res.status(400).json({ error: 'Invalid status' })
        }

        const bookings = await Room.find(query).populate('currentOccupant')
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
app.post('/api/feedback', async (req, res) => {
    const { userId, name, rating, feedback } = req.body

    if (!userId || !name || !rating || !feedback) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const newFeedback = new Feedback({ userId, name, rating, feedback })
        await newFeedback.save()
        res.status(201).json({ message: 'Feedback submitted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
        res.json(feedbacks)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id)
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' })
        }
        res.json({ message: 'Feedback deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/feedback/:id', async (req, res) => {
    const { feedback } = req.body

    if (!feedback) {
        return res.status(400).json({ error: 'Feedback is required' })
    }

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { feedback },
            { new: true }
        )
        res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
