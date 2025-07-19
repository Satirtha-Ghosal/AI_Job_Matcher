const mongoose = require('mongoose')

const jobDescriptionSchema = new mongoose.Schema({
    heading: String,
    content: [String]
})

const JobInfoSchema = new mongoose.Schema({
    id: Number,
    description: [jobDescriptionSchema],
    apply: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 7 days in seconds
    }
})

const JobInfo = mongoose.model("JobInfo", JobInfoSchema)

module.exports  = JobInfo