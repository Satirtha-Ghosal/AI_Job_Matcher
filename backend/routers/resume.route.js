const express  =require('express')

const { authenticateToken } = require('../utils/jwt.js')
const { getResume, getOptimizedResume } = require('../controllers/resume')

const resumeRouter = express.Router()
resumeRouter.use(authenticateToken)

resumeRouter.post('/buildResume/:userid', getResume)
resumeRouter.post('/optimizeResume/:userid', getOptimizedResume)

module.exports = resumeRouter