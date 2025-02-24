const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/animoid', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const VideoSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String
});

const User = mongoose.model('User', UserSchema);
const Video = mongoose.model('Video', VideoSchema);

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/videos', verifyToken, async (req, res) => {
    const { title, description, url } = req.body;
    const video = new Video({ title, description, url });
    await video.save();
    res.json(video);
});

app.get('/api/videos', async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});