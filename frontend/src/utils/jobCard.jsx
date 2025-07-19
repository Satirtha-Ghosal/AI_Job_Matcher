import { useState } from "react";
import FullScreenLoader from "./fullScreenLoader";
import { toast } from "react-toastify";

export default function JobCard({ job, applied, onShowDetails, ondelete, ondeleteApplied, fetchAll, save, isModal = false }) {

    const [loading, isLoading] = useState(false)
    const [showApplyModal, setShowApplyModal] = useState(false);

    const saveJobs = async (req, res) => {
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
                    id: job.id,
                    role: job.title,
                    company: job.company,
                    location: job.location,
                    posted_on: job.createdOn,
                    description: job.description,
                    apply: job.applyLink
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
                fetchAll();
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
                    id: job.id,
                    role: job.role,
                    company: job.company,
                    location: job.location,
                    posted_on: job.createdOn,
                    description: job.description,
                    apply: job.applyLink
                })
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            if(res.ok){
                toast.success("Job Saved Successfully !!!");
                setShowApplyModal(false);
                fetchAll();
            }
            else{
                toast.error("Something Went Wrong!!! Try Again")
            }


        } catch (error) {
            toast.error("Something Went Wrong!!! Try Again")
            console.error(error.message)
        } finally{
            isLoading(false)
        }
    };

    return (
        <>
            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add to Applied Jobs?</h2>
                        <p className="text-gray-700 mb-6">Would you like to add <strong>{job.title}</strong> at <strong>{job.company}</strong> to your applied jobs list?</p>
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


            <section className="my-6 p-6 bg-white shadow-xl rounded-xl border border-gray-200 flex flex-col">
                <FullScreenLoader show={loading} />
                <div className="flex flex-col grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
                    <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">{job.company}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">📍 Location:</span> {job.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">🗓️ Posted On:</span> {job.createdOn}
                    </p>
                </div>
                <div className="flex gap-5">
                    <a
                        onClick={applied == true ? null :() => setShowApplyModal(true)}
                        href={`https://www.adzuna.in/land/ad/${job.id}?from_adp=1&v=${job.applyLink}&se=`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition duration-200"
                    >
                        {applied == true ? "🚀 Visit Website" : "Apply On"}
                    </a>
                    <button
                        onClick={onShowDetails}
                        className="inline-block mt-3 px-3 py-2 bg-blue-600 text-white text-center rounded-md shadow hover:bg-blue-700 transition duration-200 cursor-pointer"
                    >
                        Show Details
                    </button>

                    {applied == true ? "" :
                        isModal == false ?
                            <button
                                onClick={ondelete}
                                className="inline-block mt-3 px-3 py-2 bg-red-400 text-sm text-center rounded-lg cursor-pointer hover:bg-red-600 text-white transition duration-200">
                                Delete
                            </button> : ""
                    }
                    {
                        save == true ?
                            <button
                                onClick={saveJobs}
                                className="inline-block mt-3 px-3 py-2 bg-orange-400 text-sm text-center rounded-lg cursor-pointer hover:bg-yellow-600 text-white transition duration-200">
                                Save
                            </button> : ""
                    }

                    {applied == true ?
                        <button
                            onClick={ondeleteApplied}
                            className="inline-block mt-3 px-3 py-2 bg-red-400 text-sm text-center rounded-lg cursor-pointer hover:bg-red-600 text-white transition duration-200">
                            Delete
                        </button>
                        : ""}
                </div>
            </section>
        </>
    )
}