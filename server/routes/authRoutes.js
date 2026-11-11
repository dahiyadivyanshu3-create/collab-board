const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password hash kabhi client ko nahi jaana chahiye
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // typeof check zaroori hai: warna {"email": {"$ne": null}} jaise objects query mein ghus sakte hain
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    if (!name.trim() || name.trim().length > 50) {
      return res.status(400).json({ error: 'Name is required (max 50 characters)' })
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Enter a valid email address' })
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ error: 'Password must be 8 to 72 characters' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    res.status(201).json(publicUser(savedUser))
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    // Dono case (user nahi mila / password galat) mein same message,
    // taaki koi guess na kar sake ki kaun si email registered hai
    const isMatch = user ? await bcrypt.compare(password, user.password) : false
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ message: 'Login successful', token, user: publicUser(user) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router