import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import JobRoleCard from "../../utils/jobRoleCard";
import JobCard from "../../utils/jobCard";

import FullScreenLoader from "../../utils/fullScreenLoader";

import { toast } from 'react-toastify';

export default function JobRole() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState([]);
    const [modalComponentType, setModalComponentType] = useState("role"); // "role" or "job"

    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const [isJobRoleSearchModalOpen, setIsJobRoleSearchModalOpen] = useState(false);
    const [isJobSearchModalOpen, setIsJobSearchModalOpen] = useState(false);

    const [searchJobRoleResults, setSearchJobRoleResults] = useState([]);
    const [searchJobResults, setSearchJobResults] = useState([]);

    const [searchRole, setSearchRole] = useState("")
    const [searchJob, setSearchJob] = useState("")

    const [loading, isLoading] = useState(false);
    const [generalModalloading, isGeneralModalLoading] = useState(false);
    const [jobRoleModalLoading, isJobRoleModalLoading] = useState(false);
    const [jobVacancyModalLoading, isJobVacancyModalLoading] = useState(false);

    const navigate = useNavigate();


    const openModal = async (title, type) => {

        setModalData([])
        setModalTitle(title);
        setModalComponentType(type);
        setIsModalOpen(true);
        if (title == 'Suggested Job Roles') {
            await fetchAllSuggestedRoles();
        }
        else if (title == 'Saved Job Roles') {
            await fetchAllSavedRoles();
        }
        else if (title == 'Applied Jobs') {
            await fetchAllAppliedJobs();
        }
        else {
            await fetchAllSavedJobs()
        }

    };

    const closeModal = () => setIsModalOpen(false);

    const [topSuggestedRoles, setTopSuggestedRoles] = useState([]);

    const [topSavedRoles, setTopSavedRoles] = useState([]);

    const [topAppiledJobs, setTopAppliedJobs] = useState([]);

    const [topSavedJobs, setTopSavedJobs] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, [])

    async function fetchAllData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            const res = await fetch('http://localhost:3000/api/userInfo/getTopJobs', {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                setTopSuggestedRoles(data.suggested_job_roles)
                setTopSavedRoles(data.saved_job_roles)
                setTopAppliedJobs(data.applied_jobs)
                setTopSavedJobs(data.saved_job_vacancies)
            }
            else {
                toast.error("Something Went Wrong !!! Refresh The Page")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Refresh The Page")
            console.error("Error fetching user info:", error);
        }
        finally {
            isLoading(false)
        }
    }

    async function fetchAllSuggestedRoles() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isGeneralModalLoading(true)
            const res = await fetch('http://localhost:3000/api/userInfo/getSuggestedRoles',{
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                setModalData(data.suggested_job_roles)
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error fetching user info:", error);
        }
        finally {
            isGeneralModalLoading(false)
        }
    }

    async function fetchAllSavedRoles() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isGeneralModalLoading(true);
            const res = await fetch('http://localhost:3000/api/userInfo/getSavedRoles',{
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                setModalData(data.saved_job_roles)
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }
        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error fetching user info:", error);
        }
        finally {
            isGeneralModalLoading(false);
        }
    }

    async function fetchAllAppliedJobs() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isGeneralModalLoading(true);
            const res = await fetch('http://localhost:3000/api/userInfo/getAppliedJobs',{
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                setModalData(data.applied_jobs)
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }
        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error fetching user info:", error);
        }
        finally {
            isGeneralModalLoading(false)
        }
    }

    async function fetchAllSavedJobs() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isGeneralModalLoading(true)
            const res = await fetch('http://localhost:3000/api/userInfo/getSavedJobs',{
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            console.log(data);
            if (res.ok) {
                setModalData(data.saved_jobs)
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error fetching user info:", error);
        } finally {
            isGeneralModalLoading(false)
        }
    }

    async function handleSearchJobs() {
        if (!searchJob.trim()) return;

        try {
            isJobVacancyModalLoading(true)
            const res = await fetch('http://localhost:3000/api/search/jobs', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: searchJob,
                    skills: ""
                })
            })
            const data = await res.json();
            console.log(data)
            if (res.ok) {
                setSearchJobResults(data || []);
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error searching jobs:", error);
        }
        finally {
            isJobVacancyModalLoading(false)
        }
    }

    async function handleSearchJobRoles() {
        if (!searchRole.trim()) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isJobRoleModalLoading(true)
            const res = await fetch('http://localhost:3000/api/userInfo/searchJobRoles', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: searchRole
                })
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }

            const data = await res.json();
            if (res.ok) {
                setSearchJobRoleResults(data || [])
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Error searching jobs roles:", error);
        } finally {
            isJobRoleModalLoading(false)
        }
    }

    const handleDeleteSavedJob = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true)
            const res = await fetch(`http://localhost:3000/api/userInfo/deleteSavedJob/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                toast.success("Successfully Deleted !!!")
                fetchAllSavedJobs();
                fetchAllData();
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.log(error.message)
        }
        finally {
            isLoading(false)
        }

    }


    const handleDeleteAppliedJob = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true)
            const res = await fetch(`http://localhost:3000/api/userInfo/deleteAppliedJob/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                toast.success("Successfully Deleted !!!")
                fetchAllAppliedJobs();
                fetchAllData();
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.log(error.message)
        }
        finally {
            isLoading(false)
        }

    }

    const handleDeleteSavedRoles = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            const res = await fetch(`http://localhost:3000/api/userInfo/deleteSavedJobRole/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })
            if (res.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }
            const data = await res.json()
            if (res.ok) {
                toast.success("Successfully Deleted")
                fetchAllSavedRoles();
                fetchAllData();
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.log(error.message)
        }
        finally {
            isLoading(false)
        }
    }

    return (

        <div className="p-6 bg-gray-50 min-h-screen" >

            <FullScreenLoader show={loading} />

            {isDetailPanelOpen && (
                <div
                    className="fixed inset-0 bg-black/80 bg-opacity-50 z-[90] transition-opacity duration-300"
                    onClick={() => {
                        setIsDetailPanelOpen(false);
                        setSelectedJob(null);
                    }}
                />
            )}
            <h2 className="text-4xl font-[700] px-5 text-blue-950">Job Roles</h2>

            {/* Side Detail Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[600px] bg-white shadow-lg z-[100] transform transition-transform duration-300 ${isDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 h-full overflow-y-auto relative">
                    <button
                        onClick={() => {
                            setIsDetailPanelOpen(false);
                            setSelectedJob(null);
                        }}
                        className="absolute top-4 right-4 text-red-600 font-bold text-xl"
                    >
                        ✕
                    </button>

                    {selectedJob === null ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <p className="text-lg">Loading job details...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-2">{selectedJob.title}</h2>
                            <p className="text-lg mb-1 text-gray-700">
                                <span className="font-semibold">Company:</span> {selectedJob.company}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">📍 Location:</span> {selectedJob.location}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">🗓️ Posted On:</span> {selectedJob.posted_on}
                            </p>
                            <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                {selectedJob.description.length !== 0 && (
                                    <p className="font-semibold text-lg mb-4 text-blue-800">📄 Description:</p>
                                )}
                                {selectedJob.description.length !== 0 ? selectedJob.description.map((item, index) => (
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
                            </div>

                            <a
                                href={`https://www.adzuna.in/land/ad/${selectedJob.id}?from_adp=1&v=${selectedJob.applyLink || selectedJob.apply}&se=`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                            >
                                🚀 Visit Website
                            </a>
                        </>
                    )}

                </div>
            </div>

            {/* General Modal */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
                    <div className="bg-white rounded-2xl w-[90%] max-h-[80vh] overflow-y-auto relative shadow-2xl border border-gray-200">
                        {/* Sticky Header */}
                        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-200">
                            <h2 className="text-3xl font-semibold text-blue-900">{modalTitle}</h2>
                            <button
                                onClick={closeModal}
                                className="text-red-500 hover:text-red-600 font-bold text-2xl transition"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            <FullScreenLoader show={generalModalloading} />
                            {modalData.length === 0 ? (
                                <p className="text-2xl font-bold text-gray-500 col-span-full text-center">No Results To Show</p>
                            ) : (
                                modalData.map((item, index) =>
                                    modalComponentType === "role" ? (
                                        <JobRoleCard
                                            key={index}
                                            role={item.role_title}
                                            missingSkills={item.missing_skills}
                                            matchedSkills={item.matched_skills}
                                            _id={item._id}
                                            jobid={item.id}
                                            saved={modalTitle === "Saved Job Roles" ? true : false}
                                            fetchAllData={fetchAllData}
                                            ondelete={() => { handleDeleteSavedRoles(item._id) }}
                                        />
                                    ) : (
                                        <JobCard
                                            key={index}
                                            job={{
                                                title: item.role,
                                                company: item.company,
                                                location: item.location,
                                                createdOn: item.posted_on,
                                                description: item.description,
                                                id: item.id,
                                                applyLink: item.apply,
                                                _id: item._id,
                                            }}
                                            applied={modalTitle === "Applied Jobs" ? true : false}
                                            fetchAll={fetchAllData}
                                            ondelete={() => { handleDeleteSavedJob(item._id) }}
                                            ondeleteApplied={() => {handleDeleteAppliedJob(item._id)}}
                                            onShowDetails={() => {
                                                setSelectedJob(item);
                                                setIsDetailPanelOpen(true);
                                            }}
                                        />
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Job Role Search Modal */}
            {isJobRoleSearchModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 flex justify-center items-start pt-20">
                    <FullScreenLoader show={jobRoleModalLoading} />
                    <div className="bg-indigo-50 rounded-xl w-[90%] h-[85vh] overflow-y-auto relative shadow-2xl border border-gray-200">
                        {/* Sticky Search Bar */}
                        <div className="sticky top-0 bg-indigo-50 z-10 px-6 pt-6 pb-4 border-b border-indigo-200">
                            <div className="flex justify-between items-start">
                                <input
                                    onChange={(e) => setSearchRole(e.target.value)}
                                    type="text"
                                    placeholder="🔍 Search job roles..."
                                    className="w-full p-3 border bg-white/90 border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                                />
                                <button
                                    onClick={() => setIsJobRoleSearchModalOpen(false)}
                                    className="text-red-500 hover:text-red-600 font-bold text-2xl transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <button
                                onClick={handleSearchJobRoles}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <h2 className="text-3xl font-semibold my-6 text-blue-900">Search Job Roles</h2>
                            <div className="flex flex-wrap gap-5">
                                {searchJobRoleResults.length == 0 ? (
                                    <p className="text-lg text-gray-500 italic col-span-full text-center">No jobs found. Try a different keyword.</p>
                                ) : (
                                    searchJobRoleResults.map((item, index) => (
                                        <JobRoleCard key={index} role={item.job_title} missingSkills={item.missing_skills} matchedSkills={item.matched_skills} jobid={item.id} 
                                        fetchAllData={fetchAllData}
                                             ondelete={() => { handleDeleteSavedRoles(item._id) }} />
                                    )))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Vacancies Search Modal */}
            {isJobSearchModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 flex justify-center items-start pt-20">
                    <FullScreenLoader show={jobVacancyModalLoading} />
                    <div className="bg-indigo-50 rounded-xl w-[90%] h-[85vh] overflow-y-auto relative shadow-2xl border border-gray-200">
                        {/* Sticky Search Bar */}
                        <div className="sticky top-0 bg-indigo-50 z-10 px-6 pt-6 pb-4 border-b border-indigo-200">
                            <div className="flex justify-between items-start">
                                <input
                                    onChange={(e) => setSearchJob(e.target.value)}
                                    type="text"
                                    placeholder="🔍 Search jobs..."
                                    className="w-full p-3 border bg-white/90 border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                                />
                                <button
                                    onClick={() => setIsJobSearchModalOpen(false)}
                                    className="text-red-500 hover:text-red-600 font-bold text-2xl transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <button
                                onClick={handleSearchJobs}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <h2 className="text-3xl font-semibold my-6 text-blue-900">Search Job Vacancies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchJobResults.length === 0 ? (
                                    <p className="text-lg text-gray-500 italic col-span-full text-center">No jobs found. Try a different keyword.</p>
                                ) : (
                                    searchJobResults.map((item, index) => (
                                        <JobCard
                                            key={index}
                                            job={{
                                                title: item.role,
                                                company: item.company,
                                                location: item.location,
                                                createdOn: item.posted_on,
                                                description: item.description,
                                                id: item.id,
                                                applyLink: item.apply,
                                            }}
                                            isModal={true}
                                            save = {true}
                                            fetchAll={fetchAllData}
                                            ondelete={() => { handleDeleteSavedJob(item._id) }}
                                            ondeleteApplied={() => {handleDeleteAppliedJob(item._id)}}
                                            onShowDetails={() => {
                                                setSelectedJob(item);
                                                setIsDetailPanelOpen(true);
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-200 rounded-2xl my-4 px-10 py-2">
                {/* Search Bar */}
                <div className="mb-8 mt-4 flex flex-col lg:flex-row gap-4 justify-center">
                    <input
                        type="text"
                        placeholder="🔍 Search Job Roles..."
                        className="lg:w-1/2 w-full p-3 border bg-white/70 border-gray-300 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onFocus={() => setIsJobRoleSearchModalOpen(true)}
                    />
                    <input
                        type="text"
                        placeholder="🔍 Search Job Vacancies..."
                        className="lg:w-1/2 w-full p-3 border bg-white/70 border-gray-300 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onFocus={() => setIsJobSearchModalOpen(true)}
                    />
                </div>


                {/* Suggested Section */}
                <Section
                    title="Suggested Job Roles"
                    onSeeAll={() => openModal("Suggested Job Roles", "role")}
                >
                    {
                        topSuggestedRoles.length == 0 ? <p className="text-2xl font-bold text-gray-600">No Suggested Job Roles</p>

                            : topSuggestedRoles.map((item, index) => (
                                index <= 2 ? <JobRoleCard key={index} role={item.role_title} missingSkills={item.missing_skills} matchedSkills={item.matched_skills} _id={item._id} jobid={item.id}
                                fetchAllData={fetchAllData}
                                             ondelete={() => { handleDeleteSavedRoles(item._id) }} /> : ""
                            ))
                    }
                </Section>

                {/* Saved Section */}
                <Section
                    title="Saved Job Roles"
                    onSeeAll={() => openModal("Saved Job Roles", "role")}
                >
                    {
                        topSavedRoles.length == 0 ? <p className="text-2xl font-bold text-gray-600">No Saved Job Roles</p>
                            : topSavedRoles.map((item, index) => (
                                index <= 2 ? <JobRoleCard key={index} role={item.role_title} missingSkills={item.missing_skills} matchedSkills={item.matched_skills} _id={item._id} jobid={item.id} saved={true}
                                                fetchAllData={fetchAllData}
                                             ondelete={() => { handleDeleteSavedRoles(item._id) }} /> : ""
                            ))}
                </Section>

                {/* Applied Jobs */}
                <Section
                    title="Applied Jobs"
                    onSeeAll={() => openModal("Applied Jobs", "job")}
                >
                    {topAppiledJobs.length == 0 ? <p className="text-2xl font-bold text-gray-600">No Applied Jobs</p>

                        : topAppiledJobs.map((item, index) => (
                            index <= 2 ? <JobCard
                                key={index}
                                job={{
                                    title: item.role,
                                    company: item.company,
                                    location: item.location,
                                    createdOn: item.posted_on,
                                    description: item.description,
                                    id: item.id,
                                    applyLink: item.apply,
                                    _id: item._id
                                }}
                                applied={true}
                                fetchAll={fetchAllData}
                                ondelete={() => { handleDeleteSavedJob(item._id) }}
                                ondeleteApplied={() => {handleDeleteAppliedJob(item._id)}}
                                onShowDetails={() => {
                                    setSelectedJob(item)
                                    setIsDetailPanelOpen(true)
                                }}
                            /> : ""
                        ))}
                </Section>

                {/* Saved Vacancies */}
                <Section
                    title="Saved Job Vacancies"
                    onSeeAll={() => openModal("Saved Job Vacancies", "job")}
                >
                    {topSavedJobs.length == 0 ? <p className="text-2xl font-bold text-gray-600">No Saved Job Vacancies</p>
                        : topSavedJobs.map((item, index) => (
                            index <= 2 ? <JobCard
                                key={index}
                                job={{
                                    title: item.role,
                                    company: item.company,
                                    location: item.location,
                                    createdOn: item.posted_on,
                                    description: item.description,
                                    id: item.id,
                                    applyLink: item.apply,
                                    _id: item._id
                                }}
                                fetchAll={fetchAllData}
                                ondelete={() => { handleDeleteSavedJob(item._id) }}
                                ondeleteApplied={() => {handleDeleteAppliedJob(item._id)}}
                                onShowDetails={() => {
                                    setSelectedJob(item)
                                    setIsDetailPanelOpen(true)
                                }}
                            /> : ""
                        ))}
                </Section>
            </div>
        </div>
    );
}

// Reusable Section Component
function Section({ title, children, onSeeAll }) {
    return (
        <div className="mb-10 bg-white/50 rounded-2xl shadow-2xl shadow-black/30">
            <div className="flex justify-between">
                <h4 className="text-2xl font-bold pt-5 px-5 text-gray-800 mb-4">{title}</h4>
                <p onClick={onSeeAll} className="pt-5 pr-10 text-blue-600 text-[18px] cursor-pointer">See all</p>
            </div>
            <div className="grid grid-cols-3 gap-2 p-5 pt-0 overflow-scroll">
                {children}
            </div>
        </div>
    );
}
