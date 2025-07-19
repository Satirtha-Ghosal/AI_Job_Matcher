const UserInfo = require('../model/userInfo.model.js')

const {generateAccessToken} = require('../utils/jwt.js')

const signup = async (req, res) => {
    try {
        const { userid, pass } = req.body
        const member = await UserInfo.findOne({ userid });
        if (member) {
            res.status(400).json({ message: "User Already Exists !!!" })
        }
        else {
            const newUser = new UserInfo({
                userid,
                pass,
                firstname: "",
                lastname: "",
                dob: null,
                email: "",
                phone: "",
                linkedin: "",
                github: "",
                portfolio: "",

                languages: [],
                developer_tools: [],
                tech_stack: [],
                miscellaneous: [],
                soft_skills: [],

                experience: [],
                education: [],
                projects: [],
                certificates: [],

                jobs: {
                    suggested_jobs_roles: [],
                    saved_job_roles: [],
                    applied_jobs: [],
                    saved_job_vacancies: []
                },

                courses: {
                    saved_courses: [],
                    suggested_courses: []
                }
            });

            await newUser.save();
            const token = generateAccessToken(userid)
            res.status(200).json({ message: "User created successfully", user: newUser, accessToken: token });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const signin = async (req, res) => {
  try {
    const { userid, pass } = req.body;

    // Check if user exists
    const user = await UserInfo.findOne({ userid });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = (user.pass === pass);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateAccessToken(userid); // or user.userid if you prefer

    // Send response
    res.status(200).json({
      message: 'Login successful',
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    signup, 
    signin
}