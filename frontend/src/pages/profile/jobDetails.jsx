import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';

import JobDetailsCard from "../../utils/jobDetailsCard";

import FullScreenLoader from '../../utils/fullScreenLoader';

import { toast } from 'react-toastify';


export default function JobDetails() {
    const location = useLocation();
    const message = location.state;

    const [loading, isLoading] = useState(false);

    const [jobs, setJobs] = useState();


    useEffect(() => {
        async function fetchData() {
            try {
                isLoading(true)
                if (message) {
                    console.log("Hitting api")
                    console.log(message)
                    const data = await fetch('http://localhost:3000/api/search/jobs', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: message.role,
                            skills: message.skills
                        })
                    })

                    const jobsData = await data.json();
                    console.log("jobsdata", jobsData)
                    if (data.ok) {
                        setJobs(jobsData)
                    }
                    else {
                        toast.error("Something Went Wrong !!! Refresh The Page")
                    }

                    console.log(jobsData)
                }
            } catch (error) {
                toast.error("Something Went Wrong !!! Refresh The Page")
                console.error(error.message)
            } finally {
                isLoading(false)
            }
        }

        fetchData()
    }, [])


    return (
        <>
            <div className="p-5">
                <FullScreenLoader show={loading} />
                <h3 className="text-4xl font-[700] px-5 text-blue-950 text-shadow-lg/10 shadow-black">Job Details</h3>
                <div className="bg-slate-200 rounded-2xl my-4 px-10 py-2 min-h-screen">
                    {jobs?.map((item, index) => {
                        return (
                            <JobDetailsCard key={index} id={item.id} title={item.role} company={item.company} description={item.description} location={item.location} createdOn={item.posted_on} applyLink={item.apply} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}