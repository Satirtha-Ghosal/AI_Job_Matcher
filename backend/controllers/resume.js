const UserInfo = require('../model/userInfo.model.js')
const { extractWeights, buildResume, optimizeResume } = require('../utils/ats.js')

const getResume = async (req, res) => {
    try {
        const { userid } = req.user;
        const { jd } = req.body;

        if (!jd) {
            return res.status(400).json({ message: "Job Description (jd) is required." });
        }

        // Fetch user profile from DB
        const user_data = await UserInfo.findOne({ userid }).select(
            "languages developer_tools tech_stack miscellaneous soft_skills experience education projects certificates"
        );
        const user = await UserInfo.findOne({ userid }).select(
            "firstname lastname dob email phone linkedin github portfolio"
        );
        if (!user_data) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Step 1: Get section weights from JD
        const weightsText = await extractWeights(jd); // keep it as text (raw JSON string)

        // Step 2: Build resume with JD, raw weights, and profile
        const profileText = JSON.stringify(user_data); // pass as string
        const resumeText = await buildResume(jd, weightsText, profileText); // buildResume expects raw strings

        // Step 3: Return final parsed JSON resume
        const parsedResume = JSON.parse(resumeText); // parse before sending to client

        const userInfoFields = user ? {
            firstname: user.firstname,
            lastname: user.lastname,
            dob: user.dob,
            email: user.email,
            phone: user.phone,
            linkedin: user.linkedin,
            github: user.github,
            portfolio: user.portfolio
        } : {};

        // Merge user info into resume
        const finalResponse = {
            ...parsedResume,
            user: userInfoFields
        };

        return res.status(200).json(finalResponse);

    } catch (error) {
        console.error("Error in buildResumeAPI:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getOptimizedResume = async (req, res) => {
    try {
        const { userid } = req.user;
        const { jd, resume } = req.body;

        if (!jd) {
            return res.status(400).json({ message: "Job Description (jd) is required." });
        }

        // Fetch user profile from DB
        const user_data = await UserInfo.findOne({ userid }).select(
            "languages developer_tools tech_stack miscellaneous soft_skills experience education projects certificates"
        );

        if (!user_data) {
            return res.status(404).json({ message: "User profile not found." });
        }

        const weightsText = await extractWeights(jd); // keep it as text (raw JSON string)

        // Step 2: Build resume with JD, raw weights, and profile
        const profileText = JSON.stringify(user_data); // pass as string

        const resumeText = await optimizeResume(jd, profileText, weightsText, resume)

        const parsedResume = JSON.parse(resumeText);

        return res.status(200).json(parsedResume);

    } catch (error) {
        console.error("Error in optimizeResumeAPI:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
module.exports = {
    getResume,
    getOptimizedResume
}