const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already registered.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send('Successfully registered!');
    } catch (err) {
        res.status(500).send('An error occurred during registration.');
    }
});

router.post('/login', async (req, res) => {
    console.log('Login request received');
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log('User found:', user.email);
        }
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send(err);
    }
});


module.exports = router;
