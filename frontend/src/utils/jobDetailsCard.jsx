import { useState } from "react";
import { useNavigate } from "react-router";
import FullScreenLoader from "./fullScreenLoader";

import { toast } from "react-toastify";

export default function JobDetailsCard({ title, company, description, location, createdOn, applyLink, id }) {

    const [loading, isLoading] = useState(false)
    const [showApplyModal, setShowApplyModal] = useState(false);
    const navigate = useNavigate();

    const saveJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            const res = await fetch('http://localhost:3000/api/userInfo/saveJobVacancy', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    role: title,
                    company: company,
                    location: location,
                    posted_on: createdOn,
                    description: description,
                    apply: applyLink
                })
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }

            if (res.ok) {
                toast.success("Job Saved Successfully !!!");
            }
            else {
                toast.error("Something Went Wrong!!! Try Again")
            }
        } catch (error) {
            toast.error("Something Went Wrong!!! Try Again")
            console.error(error.message)
        } finally {
            isLoading(false)
        }
    }

    const handleConfirmApply = async () => {
        try {
            isLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            const res = await fetch('http://localhost:3000/api/userInfo/saveAppliedJob', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    role: role,
                    company: company,
                    location: location,
                    posted_on: createdOn,
                    description: description,
                    apply: applyLink
                })
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            if (res.ok) {
                toast.success("Job Saved Successfully !!!");
                setShowApplyModal(false);
            }
            else {
                toast.error("Something Went Wrong!!! Try Again")
            }


        } catch (error) {
            toast.error("Something Went Wrong!!! Try Again")
            console.error(error.message)
        } finally {
            isLoading(false)
        }
    };

    return (
        <div className="my-8 p-8 bg-white shadow-xl rounded-2xl border border-gray-300 transition hover:shadow-2xl duration-200">
            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add to Applied Jobs?</h2>
                        <p className="text-gray-700 mb-6">Would you like to add <strong>{title}</strong> at <strong>{company}</strong> to your applied jobs list?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmApply}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Basic Details */}
            <FullScreenLoader show={loading} />
            <section className="mb-10">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-3">{title}</h2>
                <p className="text-xl text-gray-800 font-semibold mb-1">{company}</p>
                <p className="text-base text-gray-600 mb-1">
                    <span className="font-medium">📍 Location:</span> {location}
                </p>
                <p className="text-base text-gray-600 mb-4">
                    <span className="font-medium">🗓️ Posted On:</span> {createdOn}
                </p>

                <section className="mt-6">
                    {description.length !== 0 && (
                        <p className="font-semibold text-lg mb-4 text-blue-800">📄 Description:</p>
                    )}
                    {description.length !== 0 ? description.map((item, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-lg font-bold text-gray-800 mb-2">{item.heading}</p>
                            <ul className="list-disc pl-6 space-y-1">
                                {item.content.map((point, idx) => (
                                    <li key={idx} className="text-base text-gray-700">{point}</li>
                                ))}
                            </ul>
                        </div>
                    )) : (
                        <p className="text-gray-500 italic">No job description available.</p>
                    )}
                </section>

                <div className="flex flex-wrap gap-4 mt-6">
                    <a
                        onClick={()=>setShowApplyModal(true)}
                        href={`https://www.adzuna.in/land/ad/${id}?from_adp=1&v=${applyLink}&se=`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
                    >
                        🚀 Apply Now
                    </a>
                    <button onClick={saveJobs} className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-amber-600 transition duration-200">
                        🔖 Save Job
                    </button>
                </div>
            </section>
        </div>
    );
}
