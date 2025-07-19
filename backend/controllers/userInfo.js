const UserInfo = require('../model/userInfo.model.js')
const _ = require('lodash')

const getUserInfo = async (req, res) => {
    try {
        const { userid } = req.user
        const user = await UserInfo.findOne({ userid }).select('firstname lastname dob email phone linkedin github portfolio languages developer_tools tech_stack miscellaneous soft_skills experience education projects certificates')

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const { userid } = req.user;
        const updates = req.body;

        const existingUser = await UserInfo.findOne({ userid });

        const skillFields = ['languages', 'developer_tools', 'tech_stack', 'miscellaneous', 'soft_skills'];
        let skillChanged = false;

        for (const field of skillFields) {
            const oldVal = existingUser[field] || [];
            const newVal = updates[field] || oldVal;

            if (!_.isEqual(oldVal.sort(), newVal.sort())) {
                skillChanged = true;
                break;
            }
        }

        const updateUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-pass-__v');

        if (skillChanged) {
            const combinedSkills = [
                ...(updates.languages || existingUser.languages || []),
                ...(updates.developer_tools || existingUser.developer_tools || []),
                ...(updates.tech_stack || existingUser.tech_stack || []),
                ...(updates.miscellaneous || existingUser.miscellaneous || []),
                ...(updates.soft_skills || existingUser.soft_skills || []),
            ];

            const savedRolesID = []

            for (let job of existingUser.jobs.saved_job_roles) {
                savedRolesID.push(job.id)
            }

            try {
                const jobFetchRes = await fetch('https://satirtha-ghosal-jobrolematcherfromskillapi.hf.space/match_jobs', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ skills: combinedSkills })
                })

                const data = await jobFetchRes.json();
                console.log(data);

                const jobUpdated = await fetch('https://satirtha-ghosal-jobrolematcherfromskillapi.hf.space/evaluate_selected_jobs', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ skills: combinedSkills, job_ids: savedRolesID })
                })

                const jobUpdatedData = await jobUpdated.json();
                console.log(jobUpdatedData);

                const suggestedJobs = data.map(job => ({
                    id: job.id,
                    role_title: job.job_title,
                    matched_skills: job.matched_skills,
                    missing_skills: job.missing_skills
                }));

                const savedJobs = jobUpdatedData.map(job => ({
                    id: job.id,
                    role_title: job.job_title,
                    matched_skills: job.matched_skills,
                    missing_skills: job.missing_skills
                }));

                updateUser.jobs.suggested_jobs_roles = suggestedJobs;
                updateUser.jobs.saved_job_roles = savedJobs;


                await updateUser.save();


            } catch (error) {
                console.error('Error fetching suggested jobs:', error.message);
            }

        }

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateSkill = async (req, res) => {
    try {
        const { userid } = req.user
        const { name, type } = req.body;

        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $addToSet: { [type]: name } },
            { new: true, runValidators: true }
        ).select('-pass-__v');

        await updatedUser.save();

        const existingUser = await UserInfo.findOne({ userid });

        const combinedSkills = [
            ...(existingUser.languages || []),
            ...(existingUser.developer_tools || []),
            ...(existingUser.tech_stack || []),
            ...(existingUser.miscellaneous || []),
            ...(existingUser.soft_skills || []),
        ];

        const savedRolesID = []

        for (let job of existingUser.jobs.saved_job_roles) {
            savedRolesID.push(job.id)
        }

        try {
            const jobFetchRes = await fetch('https://satirtha-ghosal-jobrolematcherfromskillapi.hf.space/match_jobs', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ skills: combinedSkills })
            })

            const data = await jobFetchRes.json();
            console.log(data);

            const jobUpdated = await fetch('https://satirtha-ghosal-jobrolematcherfromskillapi.hf.space/evaluate_selected_jobs', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ skills: combinedSkills, job_ids: savedRolesID })
            })

            const jobUpdatedData = await jobUpdated.json();
            console.log(jobUpdatedData);

            const suggestedJobs = data.map(job => ({
                id: job.id,
                role_title: job.job_title,
                matched_skills: job.matched_skills,
                missing_skills: job.missing_skills
            }));

            existingUser.jobs.saved_job_roles = existingUser.jobs.saved_job_roles.map(savedJob => {
                const matched = jobUpdatedData.find(j => j.id == savedJob.id);
                if (matched) {
                    return {
                        ...savedJob.toObject(), // if Mongoose subdoc, convert to plain object
                        matched_skills: matched.matched_skills,
                        missing_skills: matched.missing_skills
                    };
                }
                return savedJob;
            });

            existingUser.jobs.suggested_jobs_roles = suggestedJobs;

            existingUser.markModified('jobs.saved_job_roles');
            await existingUser.save();

        } catch (error) {
            console.error('Error fetching suggested jobs:', error.message);
        }

        res.status(200).json(existingUser[type])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTopJobs = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const getTop3 = (arr) => {
            return [...arr]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 4)
        }

        const topSavedJobRoles = getTop3(user.jobs.saved_job_roles || [])
        const topSuggestedJobRoles = getTop3(user.jobs.suggested_jobs_roles || [])
        const topAppliedJobs = getTop3(user.jobs.applied_jobs || [])
        const topSavedJobVacancies = getTop3(user.jobs.saved_job_vacancies || [])

        res.status(200).json({
            saved_job_roles: topSavedJobRoles,
            suggested_job_roles: topSuggestedJobRoles,
            applied_jobs: topAppliedJobs,
            saved_job_vacancies: topSavedJobVacancies
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getSavedRoles = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const savedJobRoles = user.jobs.saved_job_roles || []

        res.status(200).json({
            saved_job_roles: savedJobRoles
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getSuggestedRoles = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const suggestedJobRoles = user.jobs.suggested_jobs_roles || []

        res.status(200).json({
            suggested_job_roles: suggestedJobRoles
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getAppliedJobs = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const applied_jobs = user.jobs.applied_jobs || []

        res.status(200).json({
            applied_jobs: applied_jobs
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getSavedJobs = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const saved_jobs = user.jobs.saved_job_vacancies || []

        res.status(200).json({
            saved_jobs: saved_jobs
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getTopCourses = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const getTop3 = (arr) => {
            return [...arr]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 4)
        }

        const topSavedCourses = getTop3(user.courses.saved_courses || [])

        res.status(200).json({
            topSavedCourses: topSavedCourses
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSavedCourses = async (req, res) => {
    try {
        const { userid } = req.user

        const user = await UserInfo.findOne({ userid })

        const saved_courses = user.courses.saved_courses || []

        res.status(200).json({
            saved_courses: saved_courses
        })

    } catch (error) {
        res.status(500).json(error);
    }
}

const getJobRoleByID = async (req, res) => {
    try {
        const { userid } = req.user
        const { id } = req.body;

        if (!userid || !id) {
            return res.status(400).json({ message: "Missing userid or id" });
        }

        const user = await UserInfo.findOne({ userid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const allRoles = [
            ...(user.jobs.saved_job_roles || []),
            ...(user.jobs.suggested_jobs_roles || [])
        ];

        const matchedRole = allRoles.find(role => role._id.toString() == id);

        if (!matchedRole) {
            return res.status(404).json({ message: "Job role not found in saved or suggested roles" });
        }

        return res.status(200).json(matchedRole);

    } catch (error) {
        res.status(500).json(error)
    }
}

const searchJobRoles = async (req, res) => {
    try {
        const { userid } = req.user
        const { title } = req.body

        const existingUser = await UserInfo.findOne({ userid });

        const combinedSkills = [
            ...(existingUser.languages || []),
            ...(existingUser.developer_tools || []),
            ...(existingUser.tech_stack || []),
            ...(existingUser.miscellaneous || []),
            ...(existingUser.soft_skills || []),
        ];

        try {
            const jobFetchRes = await fetch('https://satirtha-ghosal-jobrolematcherfromskillapi.hf.space/match_jobs_by_title', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ job_title: title, skills: combinedSkills })
            })

            const data = await jobFetchRes.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({message: error.message})
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

const saveJobRole = async (req, res) => {
    try {
        const { userid } = req.user
        const newJobRole = req.body;

        if (!newJobRole || !newJobRole.role_title) {
            return res.status(400).json({ message: 'Job role data is incomplete or missing' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $addToSet: { 'jobs.saved_job_roles': newJobRole } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedUser.jobs.saved_job_roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveJobVacancy = async (req, res) => {
    try {
        const { userid } = req.user
        const newJobVacancy = req.body;

        if (!newJobVacancy || !newJobVacancy.company || !newJobVacancy.description) {
            return res.status(400).json({ message: 'Job vacancy data is incomplete or missing' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $addToSet: { 'jobs.saved_job_vacancies': newJobVacancy } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedUser.jobs.saved_job_vacancies);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const saveAppliedJob = async (req, res) => {
    try {
        const { userid } = req.user
        const newJob = req.body;

        if (!newJob || !newJob.company || !newJob.description) {
            return res.status(400).json({ message: 'Job data is incomplete or missing' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $addToSet: { 'jobs.applied_jobs': newJob } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedUser.jobs.applied_jobs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteSavedJobRole = async (req, res) => {
    try {
        const { userid } = req.user
        const { jobRoleId } = req.params;
        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $pull: { 'jobs.saved_job_roles': { _id: jobRoleId } } },
            { new: true }
        )

        res.status(200).json(updatedUser.jobs.saved_job_roles);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteSavedJob = async (req, res) => {
    try {
        const { userid } = req.user
        const { jobId } = req.params;
        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $pull: { 'jobs.saved_job_vacancies': { _id: jobId } } },
            { new: true }
        )

        res.status(200).json(updatedUser.jobs.saved_job_vacancies);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAppliedJob = async (req, res) => {
    try {
        const { userid } = req.user
        const { jobId } = req.params;
        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $pull: { 'jobs.applied_jobs': { _id: jobId } } },
            { new: true }
        )

        res.status(200).json(updatedUser.jobs.applied_jobs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const saveCourse = async (req, res) => {
    try {
        const { userid } = req.user
        const { course } = req.body;
        const updatedUser = await UserInfo.findOneAndUpdate(
            { userid },
            { $addToSet: { 'courses.saved_courses': course } },
            { new: true, runValidators: true }
        )

        res.status(200).json(updatedUser.courses.saved_courses)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo,
    getTopJobs,
    getSuggestedRoles,
    getSavedRoles,
    getAppliedJobs,
    getSavedJobs,
    getJobRoleByID,
    searchJobRoles,
    saveJobRole,
    saveJobVacancy,
    saveAppliedJob,
    deleteSavedJob,
    deleteAppliedJob,
    deleteSavedJobRole,
    saveCourse,
    updateSkill,
    getTopCourses,
    getSavedCourses
}
