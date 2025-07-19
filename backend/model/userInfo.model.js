const mongoose = require('mongoose')

// Subdocument schemas
const jobRoleSchema = new mongoose.Schema({
    role_title: String,
    matched_skills: [String],
    missing_skills: [String],
    id: String
}, { _id: true, timestamps: true })

const jobDescriptionSchema = new mongoose.Schema({
    heading: String,
    content: [String]
})

const jobVacancySchema = new mongoose.Schema({
    id: String,
    role: String,
    company: String,
    location: String,
    posted_on: Date,
    description: [jobDescriptionSchema],
    apply: String
}, { _id: true, timestamps: true })


const experienceSchema = new mongoose.Schema({
    title: String,
    company: String,
    duration: String,
    description: String
}, { _id: true })

const educationSchema = new mongoose.Schema({
    level: String,
    institution: String,
    percentage_point: Number,
    duration: String
}, { _id: true })

const projectSchema = new mongoose.Schema({
    title: String,
    about: String,
    techstack: [String],
    feature: [String],
    link: String
}, { _id: true })

const certificateSchema = new mongoose.Schema({
    title: String,
    institution: String,
    description: String,
    link: String
}, { _id: true })

const courses = new mongoose.Schema({
    imgSrc: String,
    courseSrc: String,
    title: String,
    desc: String,
    fullStar: Number,
    halfStar: Number,
    emptyStar: Number,
    duration: String,
    platform: String
}, { _id: true, timestamps: true })

// Main schema
const UserInfoSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    firstname: String,
    lastname: String,
    dob: Date,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    portfolio: String,

    languages: [String],
    developer_tools: [String],
    tech_stack: [String],
    miscellaneous: [String],
    soft_skills: [String],

    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certificates: [certificateSchema],

    jobs: {
        suggested_jobs_roles: [jobRoleSchema],
        saved_job_roles: [jobRoleSchema],
        applied_jobs: [jobVacancySchema],
        saved_job_vacancies: [jobVacancySchema]
    },

    courses: {
        saved_courses: [courses]
    }
})

const UserInfo = mongoose.model("UserInfo", UserInfoSchema)

module.exports = UserInfo
