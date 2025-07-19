const express = require('express')
const authRouter = express.Router()

const { signup, signin } = require('../controllers/auth.js')

authRouter.post('/signUp', signup)
authRouter.post('/signIn', signin)

module.exports = authRouter