import SineCurveSkillGap from "../../utils/missingSkillPattern";
import SkillGapCard from "../../utils/skillGapCard";

import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

import Loader from 'react-js-loader';

import { toast } from 'react-toastify';

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import FullScreenLoader from "../../utils/fullScreenLoader";

export default function SkillAnalysis() {

    const [details, setDetails] = useState()
    const [match, setMatch] = useState(0)

    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [courses, setCourses] = useState([]);
    const [skillChanged, setSkillChanged] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formSkill, setFormSkill] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formType, setFormType] = useState('');

    const [loading, isLoading] = useState(false);
    const [modalLoading, isModalLoading] = useState(false)
    const [detailsPaneLoading, isDetailsPaneLoading] = useState(false)

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const isDetails = searchParams.get('isDetails')
    const id = searchParams.get('id')

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedSkill != null) {
            const fetchCourses = async () => {
                try {
                    isDetailsPaneLoading(true);
                    const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/search/courses', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ skill: selectedSkill })
                    })

                    const data = await res.json();
                    if (res.ok) {
                        setCourses(data);
                    }
                    else {
                        toast.error("Something Went Wrong !!! Try Again")
                    }

                    console.log(courses)
                } catch (error) {
                    toast.error("Something Went Wrong !!! Try Again")
                }
                finally {
                    isDetailsPaneLoading(false)
                }
            }

            fetchCourses();
        }

    }, [selectedSkill])



    useEffect(() => {
        if (isDetails === 'false') {
            async function fetchData() {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        toast.error("You must be logged in.");
                        navigate(".././auth/login");
                        return;
                    }
                    isLoading(true)
                    const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/userInfo/getJobRolesByID', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            id: id
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
                    console.log(data)
                    if (res.ok) {
                        setDetails(data)
                        setMatch((data.matched_skills.length * 100) / (data.matched_skills.length + data.missing_skills.length))
                    }
                    else {
                        toast.error("Something Went Wrong !!! Refresh The Page")
                    }
                    console.log(details)
                } catch (error) {
                    toast.error("Something Went Wrong !!! Refresh The Page")
                    console.error(error.message)
                } finally {
                    isLoading(false)
                }
            }

            fetchData()
        }
        else {
            const data = location.state;
            console.log(data)
            setDetails(data)
            setMatch((data.matched_skills.length * 100) / (data.matched_skills.length + data.missing_skills.length))
        }
    }, [skillChanged, id, isDetails])


    const saveCourse = async (courses) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true)
            if (courses != null) {
                const payload = {
                    imgSrc: courses.imageSrc,
                    courseSrc: courses.courseHref,
                    title: courses.courseName,
                    desc: courses.description,
                    fullStar: courses.starFull,
                    halfStar: courses.starHalf,
                    emptyStar: courses.starEmpty,
                    duration: courses.workload,
                    platform: courses.platform
                }

                console.log(payload)

                const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/userInfo/saveCourse', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ course: payload })
                })

                if (res.status === 403) {
                    // Invalid or expired token
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem("token");
                    navigate(".././auth/login");
                    return;
                }

                if (res.ok) {
                    toast.success("Course Saved Successfully !!!")
                }
                else {
                    toast.error("Something Went Wrong !!! Try Again")
                }
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error(error.message)
        } finally {
            isLoading(false)
        }
    }

    const updateSkill = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isModalLoading(true)
            const res = await fetch('https://ai-job-matcher-wlii.onrender.com/api/userInfo/updateSkill', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: formTitle, type: formType })
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
                toast.success("Skill Updated Successfully !!!")
                if (isDetails === 'false') {
                    setSkillChanged(skillChanged => !skillChanged)
                }
                else {
                    setDetails((prevDetails) => {
                        if (!prevDetails) return prevDetails;

                        const newMissingSkills = prevDetails.missing_skills.filter(skill => skill !== formSkill);
                        const newMatchedSkills = [...prevDetails.matched_skills, formSkill];

                        return {
                            ...prevDetails,
                            missing_skills: newMissingSkills,
                            matched_skills: newMatchedSkills
                        };
                    })
                }
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }
            console.log(data)

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error(error.message)
        } finally {
            isModalLoading(false)
        }
    }


    return (
        <>

            {isDetailPanelOpen && (
                <div
                    className="fixed inset-0 bg-black/80 bg-opacity-50 z-[90] transition-opacity duration-300"
                    onClick={() => {
                        setIsDetailPanelOpen(false);
                        setSelectedSkill(null);
                        setCourses(null)
                    }}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-lg z-[100] transform transition-transform duration-300 ${isDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full overflow-y-auto relative flex flex-col">
                    <div className="px-6 py-4 flex justify-between border-b-[1px] border-gray-300 shadow-xl shadow-gray-600/20">
                        <h4 className="text-2xl font-semibold text-indigo-800">{selectedSkill}</h4>
                        <button
                            onClick={() => {
                                setIsDetailPanelOpen(false);
                                setSelectedSkill(null);
                                setCourses(null)
                            }}
                            className="absolute top-4 right-4 text-red-600 font-bold text-xl"
                        >
                            ✕
                        </button>
                    </div>
                    {
                        selectedSkill && (
                            <div className="p-6 flex flex-col gap-5 grow">
                                {!detailsPaneLoading ?
                                    courses.map((item, index) => {
                                        return (<div key={index} className="bg-white rounded-xl shadow-black/20 shadow-xl p-4">
                                            <img
                                                src={item.imageSrc}
                                                alt={item.courseName}
                                                className="rounded-lg w-full h-48 object-cover mb-4 shadow-md"
                                            />
                                            <h4 className="text-xl font-bold text-indigo-800 mb-2">{item.courseName}</h4>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center  mb-2 text-yellow-500">
                                                {new Array(item.starFull).fill(0).map((_, i) => {
                                                    return (<IoStar key={i} />)
                                                })}
                                                {new Array(item.starHalf).fill(0).map((_, i) => {
                                                    return (<IoStarHalf key={i} />)
                                                })}
                                                {new Array(item.starEmpty).fill(0).map((_, i) => {
                                                    return (<IoStarOutline key={i} />)
                                                })}
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                                <span>{item.platform}</span>
                                                <span>{item.workload}</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <a href={item.courseHref} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-medium px-4 py-2 rounded hover:bg-indigo-700 transition" >Visit Course</a>
                                                <button onClick={() => saveCourse(item)} className="bg-orange-500 text-white font-medium px-4 py-2 rounded hover:bg-orange-600 transition cursor-pointer">Save Course</button>
                                            </div>

                                        </div>)
                                    })
                                    : <div className="flex justify-center items-center h-full w-full">
                                        <Loader
                                            type="hourglass"
                                            bgColor={"#6366F1"}
                                            color={"#6366F1"}
                                            size={200}
                                        /></div>
                                }
                            </div>
                        )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
                    <FullScreenLoader show={modalLoading} />
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
                        <h3 className="text-xl font-semibold text-indigo-800 mb-4">Mark as Learned</h3>

                        <label className="block mb-3">
                            <span className="text-gray-700">Course Title</span>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="mt-1 block w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-indigo-300"
                                placeholder="Enter course title"
                            />
                        </label>

                        <label className="block mb-5">
                            <span className="text-gray-700">Skill Type</span>
                            <select
                                value={formType}
                                onChange={(e) => setFormType(e.target.value)}
                                className="mt-1 block w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select type</option>
                                <option value="languages">Programming Language</option>
                                <option value="developer_tools">Developer Tools</option>
                                <option value="tech_stack">Tech Stack</option>
                                <option value="miscellaneous">Miscellaneous</option>
                                <option value="soft_skills">Soft Skill</option>
                            </select>
                        </label>

                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                onClick={updateSkill}
                            >
                                Submit
                            </button>
                        </div>

                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}




            <div className="p-5">
                <FullScreenLoader show={loading} />
                <h3 className="text-4xl font-[700] px-5 text-blue-950 text-shadow-lg/10 shadow-black">Skill Gap Analysis</h3>
                <div className="bg-slate-200 rounded-2xl my-4 px-10 py-2">
                    <div>
                        <h4 className="text-[28px] font-[700] text-indigo-950">{details?.role_title}</h4>
                        <p><span className="text-[20px] font-semibold text-cyan-900 ">Match Score: </span><span className="text-[18px] text-green-600 font-bold">{!details ? "0" : match.toFixed(0)} %</span></p>
                        <div className="w-full h-8 rounded-2xl my-2 border-4 border-white/50 shadow-xl shadow-black/30"><div style={{ width: `${match.toFixed(0)}%` }} className="bg-green-500 h-full rounded-2xl"></div></div>
                    </div>

                    <div className="flex flex-col gap-5 my-10">
                        <div className=" p-5 rounded-xl bg-white shadow-md">
                            <h5 className="text-[22px] font-semibold text-indigo-950 mb-4 border-b-2 pb-2 border-indigo-900/20">Skills You Have</h5>
                            <div className="flex flex-wrap gap-3">
                                {details?.matched_skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-indigo-200 transition-all"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-white shadow-inner border border-slate-200">
                            <h5 className="text-xl md:text-2xl font-semibold text-indigo-950 mb-6 border-b-2 border-indigo-900/20">
                                Path To Go
                            </h5>
                            <div className="flex justify-center items-center">
                                <SineCurveSkillGap
                                    skills={details?.missing_skills}
                                />
                            </div>
                        </div>


                        <div className="p-5 rounded-xl bg-white shadow-md">
                            <h5 className="text-[22px] font-semibold text-indigo-950 mb-4 border-b-2 pb-2 border-indigo-900/20">Skill Gap</h5>
                            <div className="flex flex-wrap gap-5" >
                                {
                                    details?.missing_skills.map((item, index) => {
                                        return (<SkillGapCard
                                            key={index}
                                            skillName={item}
                                            onShowCourses={() => {
                                                setSelectedSkill(item)
                                                setIsDetailPanelOpen(true)
                                            }}
                                            onMarkAsLearned={() => {
                                                setFormSkill(item);
                                                setIsModalOpen(true);
                                            }}
                                        />

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}