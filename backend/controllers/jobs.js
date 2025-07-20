const JobInfo = require('../model/jobDesc.model.js')
const axios = require('axios')
const https = require('https')
require('dotenv').config()

const scraper = require('../utils/scraper.js')

const searchJobInfo = async (req, res) => {
    try {
        const { title, skills } = req.body
        const APP_ID = process.env.ADZUNA_APP_ID
        const APP_KEY = process.env.ADZUNA_APP_KEY

        try {
            console.log(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${title}&what_or=${skills}&max_days_old=20`)
            const jobsFetched = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${title}&what_or=${skills}&max_days_old=20`, {
                timeout: 15000, // 15 seconds timeout
                httpsAgent: new https.Agent({ family: 4 }), // force IPv4
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json'
                }
            })
            console.log("hit")
            const result = await jobsFetched.data;
            const jobs = result.results;
            console.log("Jobs Fetched: ", jobs)
            const finalJobs = []

            for (const job of jobs) {
                console.log("Job A")
                const { id, redirect_url, location, title, adref, company, created } = job;

                console.log(id)

                let jobDesc = await JobInfo.findOne({ id })

                let description;
                let apply;

                if (jobDesc) {
                    console.log("Found in DB")
                    description = jobDesc.description
                    apply = jobDesc.apply
                    console.log("DB Result: ", description)
                }
                else {
                    console.log("Scraping")
                    const scrapedDescription = await scraper(`https://www.adzuna.in/details/${id}`);
                    description = scrapedDescription.sections;
                    apply = scrapedDescription.nextHref;
                    console.log("Scraped Result: ", description)
                    const newJob = new JobInfo({
                        id: id,
                        description: description,
                        apply: apply
                    })

                    await newJob.save()
                }

                finalJobs.push({
                    id: id,
                    role: title,
                    company: company.display_name,
                    location: location.display_name,
                    posted_on: created,
                    description: description,
                    apply: apply,
                    redirect_url: redirect_url
                })
            }

            console.log("response sent")
            res.status(200).json(finalJobs)

        } catch (error) {
            console.error("Error in searchJobInfo:", error);
        }
    } catch (error) {
        console.error("Error in searchJobInfo:", error);
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    searchJobInfo
}