const express = require('express')

const { authenticateToken } = require('../utils/jwt.js')

const { getUserInfo, updateUserInfo, getTopJobs, getSuggestedRoles, getSavedRoles, getAppliedJobs, getSavedJobs, searchJobRoles, saveJobRole, saveJobVacancy, deleteSavedJob, deleteSavedJobRole, getJobRoleByID, saveCourse, updateSkill, getSavedCourses, getTopCourses, deleteAppliedJob, saveAppliedJob } = require('../controllers/userInfo.js')

const userInfoRouter = express.Router()
userInfoRouter.use(authenticateToken)

userInfoRouter.get('/getUserInfo', getUserInfo)
userInfoRouter.put('/updateUserInfo', updateUserInfo)
userInfoRouter.get('/getTopJobs', getTopJobs)
userInfoRouter.get('/getSuggestedRoles', getSuggestedRoles)
userInfoRouter.get('/getSavedRoles', getSavedRoles)
userInfoRouter.get('/getAppliedJobs', getAppliedJobs)
userInfoRouter.get('/getSavedJobs', getSavedJobs)
userInfoRouter.get('/getAllSavedCourses', getSavedCourses)
userInfoRouter.get('/getTopSavedCourses', getTopCourses)
userInfoRouter.post('/getJobRolesByID', getJobRoleByID)
userInfoRouter.post('/searchJobRoles', searchJobRoles)
userInfoRouter.put('/saveJobRole', saveJobRole)
userInfoRouter.put('/saveJobVacancy', saveJobVacancy)
userInfoRouter.put('/saveAppliedJob', saveAppliedJob)
userInfoRouter.delete('/deleteSavedJobRole/:jobRoleId', deleteSavedJobRole)
userInfoRouter.delete('/deleteSavedJob/:jobId', deleteSavedJob)
userInfoRouter.delete('/deleteAppliedJob/:jobId', deleteAppliedJob)
userInfoRouter.put('/saveCourse', saveCourse)
userInfoRouter.put('/updateSkill', updateSkill)

module.exports = userInfoRouter