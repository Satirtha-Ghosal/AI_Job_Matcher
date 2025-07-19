import ProfileCard from "../../utils/profileCard";
import { MdEdit } from "react-icons/md";

import { NavLink, useNavigate } from "react-router";

import { useState, useEffect } from "react";
import FullScreenLoader from "../../utils/fullScreenLoader";

import { toast } from 'react-toastify';

export default function ViewProfile() {

    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
    };

    const [userInfo, setUserInfo] = useState({
        "firstname": "",
        "lastname": "",
        "dob": null,
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "languages": [],
        "developer_tools": [],
        "tech_stack": [],
        "miscellaneous": [],
        "soft_skills": [],
        "experience": [],
        "education": [{ level: "", institution: "", percentage_point: "", duration: "" }],
        "projects": [{ title: "", about: "", techstack: [""], feature: [""], link: "" }],
        "certificates": [{ title: "", institution: "", description: "", link: "" }]
    });

    const [loading, isLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                console.log(token)
                if (!token) {
                    toast.error("You must be logged in.");
                    navigate("./auth/login");
                    return;
                }
                isLoading(true);
                const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/userInfo/getUserInfo', {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                });

                if (res.status === 403) {
                    // Invalid or expired token
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem("token");
                    navigate("./auth/login");
                    return;
                }
                const data = await res.json();

                if (res.ok) {
                    console.log(data)
                    setUserInfo(data)
                }
                else {
                    toast.error("Something Went Wrong !!!")
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                toast.error("Something Went Wrong !!!")
            }
            finally {
                isLoading(false)
            }
        }

        fetchData();

    }, [])

    const info = {
        personal: [
            {
                title: "First Name",
                value: userInfo.firstname
            },
            {
                title: "Last Name",
                value: userInfo.lastname
            },
            {
                title: "Date of Birth",
                value: formatDate(userInfo.dob)
            }
        ],
        contacts: [
            {
                title: "Email ID",
                value: userInfo.email
            },
            {
                title: "Phone No.",
                value: userInfo.phone
            },
            {
                title: "Linkedin",
                value: userInfo.linkedin
            },
            {
                title: "GitHub",
                value: userInfo.github
            },
            {
                title: "Portfolio",
                value: userInfo.portfolio
            }
        ],
        skils: [
            {
                title: "Languages",
                value: userInfo.languages
            },
            {
                title: "Developer Tools and Platforms",
                value: userInfo.developer_tools
            },
            {
                title: "Tech Stack",
                value: userInfo.tech_stack
            },
            {
                title: "Miscellaneous",
                value: userInfo.miscellaneous
            },
            {
                title: "Soft Skills",
                value: userInfo.soft_skills
            }
        ],
        Experience: 0,
        Education: userInfo.education,
        Projects: userInfo.projects,
        Certificates: userInfo.certificates
    }



    return (
        <>
            <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
                <FullScreenLoader show={loading} />

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-extrabold text-blue-950 tracking-tight">
                        My Profile
                    </h2>
                    <NavLink
                        to={'editProfile'}
                        className="flex items-center gap-2 px-4 py-2 text-indigo-900 font-semibold bg-white border border-indigo-300 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                        <MdEdit />
                        Edit
                    </NavLink>
                </div>



                <CardWrapper title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {info.personal.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <p className="text-gray-600 font-medium">{item.title}</p>
                                <p className="text-lg font-semibold text-indigo-950">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </CardWrapper>

                <CardWrapper title="Contacts">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {info.contacts.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <p className="text-gray-600 font-medium">{item.title}</p>
                                <p className="text-lg font-semibold text-indigo-950">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </CardWrapper>

                <CardWrapper title="Skills">
                    {info.skils.map((item, index) => (
                        <div key={index} className="mb-6">
                            <h4 className="text-xl font-semibold text-indigo-700 mb-2">{item.title}</h4>
                            <div className="flex flex-wrap gap-3">
                                {item.value.map((skill, i) => (
                                    <span key={i} className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full font-semibold shadow-sm text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardWrapper>

                <CardWrapper title="Education">
                    <div className="grid lg:grid-cols-2 gap-5">
                        {info.Education.map((item, index) => (
                            <div key={index} className="bg-white/60 rounded-xl border border-white/80 p-4 shadow-md backdrop-blur-sm">
                                <h4 className="text-xl font-semibold text-indigo-900">
                                    {item.level}
                                    <span className="ml-2 text-sm font-normal italic text-gray-500">
                                        ({item.duration})
                                    </span>
                                </h4>
                                <p className="text-gray-700 font-medium">{item.institution}</p>
                                <p className="text-indigo-800 text-lg font-bold">{item.percentage_point}</p>
                            </div>
                        ))}
                    </div>
                </CardWrapper>

                <CardWrapper title="Projects">
                    {info.Projects.map((item, index) => (
                        <div key={index} className="bg-white/70 p-4 rounded-xl border border-white/80 shadow-md mb-6 backdrop-blur-md">
                            <h4 className="text-xl font-semibold text-indigo-900">{item.title}</h4>
                            <p className="italic text-sm text-gray-600">{item.about}</p>
                            <p className="mt-2">
                                <span className="font-semibold">TechStack:</span>{' '}
                                <span className="text-indigo-700 font-semibold">{item.techstack.join(', ')}</span>
                            </p>
                            <div className="mt-2">
                                <span className="font-semibold">Features:</span>
                                <ul className="list-disc list-inside text-gray-700">
                                    {item.feature.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                            <p className="mt-2 font-semibold">
                                Visit:{' '}
                                <a href={item.link} target="_blank" className="text-blue-600 underline">
                                    {item.title}
                                </a>
                            </p>
                        </div>
                    ))}
                </CardWrapper>

                <CardWrapper title="Certificates and Achievements">
                    {info.Certificates.map((item, index) => (
                        <div key={index} className="bg-white/70 p-4 rounded-xl border border-white/80 shadow-md mb-6 backdrop-blur-md">
                            <h4 className="text-xl font-semibold text-indigo-900">{item.title}</h4>
                            <p className="italic text-sm text-gray-600">{item.description}</p>
                            <p className="mt-2">
                                <span className="font-semibold">Institution:</span>{' '}
                                <span className="text-indigo-800 font-bold">{item.institution}</span>
                            </p>
                            <p className="mt-1">
                                Verify:{' '}
                                <a href={item.link} target="_blank" className="text-blue-600 underline">
                                    {item.title}
                                </a>
                            </p>
                        </div>
                    ))}
                </CardWrapper>
            </div>

        </>
    )
}

{/* Section Card */ }
const CardWrapper = ({ title, children }) => (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8 border border-white/30">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">{title}</h3>
        <hr className="border-indigo-300 mb-6" />
        {children}
    </div>
);