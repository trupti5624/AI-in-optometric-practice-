const express = require('express');
const router = express.Router();
const {User} = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User with the same email ID exists" });

        const newUser = new User({ email, passWord: password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const id = { id: user._id }
        res.json({ message: 'Login Success', token, id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Protected Route
router.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        res.json({ user: req.user });
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

module.exports = router;
