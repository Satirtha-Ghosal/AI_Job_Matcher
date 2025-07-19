import { useNavigate } from 'react-router-dom'

import { useState } from 'react';
import FullScreenLoader from './fullScreenLoader';
import { toast } from 'react-toastify';

export default function JobRoleCard({ role, missingSkills, matchedSkills, _id, jobid, saved, ondelete, fetchAllData }) {
    const score = ((matchedSkills.length) / (matchedSkills.length + missingSkills.length)) * 100;

    const [loading, isLoading] = useState(false);

    const navigate = useNavigate();

    const exploreJobs = () => {
        navigate('../jobDetails', {
            state: {
                role: role,
                skills: matchedSkills.join(' ')
            }
        })
    }

    const getRoleDetails = () => {
        if (_id) {
            navigate(`../../learning/skillGaps?isDetails=false&id=${_id}`);
        }
        else {
            navigate(`../../learning/skillGaps?isDetails=true`, {
                state: {
                    role_title: role,
                    missing_skills: missingSkills,
                    matched_skills: matchedSkills,
                    id: jobid
                }
            })
        }

    }

    const save = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            const body = {
                id: jobid,
                role_title: role,
                matched_skills: matchedSkills,
                missing_skills: missingSkills
            }

            const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/userInfo/saveJobRole', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            })

            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }

            if (res.ok) {
                fetchAllData();
                toast.success("Job Role Saved Successfully !!!")
            } else{
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error(error.message)
        } finally {
            isLoading(false);
        }
    }

    return (
        <div className="bg-white shadow-xl p-4 rounded-2xl w-full max-w-sm">
            <FullScreenLoader show={loading} />
            {/* Title with ellipsis */}
            <h2 className="text-xl font-semibold text-gray-800 truncate">{role}</h2>

            {/* Score */}
            <p className="text-sm text-gray-600 mt-1">
                Match Score: <span className="font-bold text-green-600">{score.toFixed(0)}%</span>
            </p>

            {/* Matched Skills with ellipsis */}
            <p className="text-sm mt-1">
                <span className="font-semibold text-[16px] text-gray-900">Matched Skills: </span>
                <span className="block truncate">
                    {matchedSkills.join(', ')}
                </span>
            </p>

            {/* Missing Skills with ellipsis */}
            <p className="text-sm mt-1">
                <span className="font-semibold text-[16px] text-gray-900">Missing Skills: </span>
                <span className="block truncate">
                    {missingSkills.join(', ')}
                </span>
            </p>

            <p onClick={exploreJobs} className="text-blue-600 underline cursor-pointer">Explore Job Vacancies</p>

            <div className="flex space-x-2 mt-4">
                <button onClick={getRoleDetails} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700">
                    Get Details
                </button>
                {saved != true ?
                    <button onClick={save} className="px-3 py-1 bg-gray-200 text-sm rounded-lg cursor-pointer hover:bg-gray-400">
                        ⭐ Save
                    </button> : ""}
                {saved == true ?
                    <button onClick={ondelete} className="px-3 py-1 bg-red-400 text-sm rounded-lg cursor-pointer hover:bg-red-600 text-white">
                        Delete
                    </button> : ""}
            </div>
        </div>
    );
}
