const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const userInfoRouter = require('./routers/userInfo.route');
const authRouter = require('./routers/auth.route');
const { searchJobInfo } = require('./controllers/jobs');
const searchCourse = require('./controllers/courses');
const { getResume, getOptimizedResume } = require('./controllers/resume');
const resumeRouter = require('./routers/resume.route');

require ('dotenv').config()


const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/userInfo', userInfoRouter)
app.use('/api/auth', authRouter)
app.use('/api/resume', resumeRouter)
app.post('/api/search/jobs', searchJobInfo)
app.post('/api/search/courses', searchCourse)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(`mongodb+srv://ghosalsatirtha:${process.env.MONGODB_PASSWORD}@cluster0.euqlupl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log("Connected to members db")
})
.catch(()=>{
    console.log("Error")
})