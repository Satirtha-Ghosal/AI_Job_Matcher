import { useState, useEffect } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

import { useNavigate } from "react-router";

import FullScreenLoader from "../../utils/fullScreenLoader";

import { toast } from 'react-toastify';

export default function Resources() {

    const navigate = useNavigate();

    const [savedTopCourses, setTopSavedCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allSavedCourses, setAllSavedCourses] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState({
        price: "", // "free" | "paid"
        certification: "", // "yes" | "no"
        level: "", // "beginner" | "intermediate" | "advanced"
    });
    const [searchResults, setSearchResults] = useState([]);

    const [loading, isLoading] = useState(false);
    const [modalLoading, isModalLoading] = useState(false)

    useEffect(() => {
        async function fetchSavedCourses() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("You must be logged in.");
                    navigate(".././auth/login");
                    return;
                }
                isLoading(true);
                const res = await fetch("http://localhost:3000/api/userInfo/getTopSavedCourses",{
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
                const data = await res.json();
                if (res.ok) {
                    setTopSavedCourses(data.topSavedCourses);
                }
                else {
                    toast.error("Somethign Went Wrong !!! Try Refreshing The Page")
                }

                console.log(data.topSavedCourses)
            } catch (error) {
                toast.error("Somethign Went Wrong !!! Try Refreshing The Page")
                console.error("Failed to fetch saved courses:", error);
            } finally {
                isLoading(false)
            }
        }

        fetchSavedCourses();
    }, []);

    const getAllCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isModalLoading(true);
            const res = await fetch("http://localhost:3000/api/userInfo/getAllSavedCourses",{
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
            const data = await res.json();
            if (res.ok) {
                setAllSavedCourses(data.saved_courses);
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Failed to fetch saved courses:", error);
        } finally {
            isModalLoading(false);
        }
    }

    const handleSearch = async () => {
        const params = new URLSearchParams();

        if (filter.price && filter.price !== "") {
            params.append("price", filter.price);
        }
        if (filter.certification && filter.certification !== "") {
            params.append("cert", filter.certification); // ensure it matches your API param name
        }
        if (filter.level && filter.level !== "") {
            params.append("level", filter.level);
        }

        console.log(params)
        try {
            isLoading(true);
            const res = await fetch(`http://localhost:3000/api/search/courses?${params.toString()}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ skill: searchTerm })
            });
            const data = await res.json();
            if (res.ok) {
                setSearchResults(data);
            }
            else {
                toast.error("Something Went Wrong !!! Try Again")
            }

            console.log(data)
        } catch (error) {
            toast.error("Something Went Wrong !!! Try Again")
            console.error("Failed to fetch courses:", error);
        } finally {
            isLoading(false)
        }
    };

    const saveCourse = async (courses) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            if (courses != null) {
                const payload = {
                    imgSrc: courses.imgSrc,
                    courseSrc: courses.courseSrc,
                    title: courses.title,
                    desc: courses.desc,
                    fullStar: courses.fullStar,
                    halfStar: courses.halfStar,
                    emptyStar: courses.emptyStar,
                    duration: courses.duration,
                    platform: courses.platform
                }

                console.log(payload)

                const res = await fetch('http://localhost:3000/api/userInfo/saveCourse', {
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
                    toast.success("Succesfully Saved the Course")
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

    const CourseCard = ({ item }) => (
        <div className="bg-white rounded-xl shadow-black/20 shadow-xl p-4">
            {item.imgSrc != "" ? <img
                src={item.imgSrc}
                alt={item.title}
                className="rounded-lg w-full h-48 object-cover mb-4 shadow-md"
            /> : ""}
            <h4 className="text-xl font-bold text-indigo-800 mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {item.desc}
            </p>
            <div className="flex items-center mb-2 text-yellow-500">
                {new Array(item.fullStar).fill(0).map((_, i) => <IoStar key={i} />)}
                {new Array(item.halfStar).fill(0).map((_, i) => <IoStarHalf key={i} />)}
                {new Array(item.emptyStar).fill(0).map((_, i) => <IoStarOutline key={i} />)}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{item.platform}</span>
                <span>{item.duration}</span>
            </div>
            <div className="flex gap-3">
                <a
                    href={item.courseSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white font-medium px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Visit Course
                </a>
                <button
                    onClick={() => saveCourse(item)}
                    className="bg-orange-500 text-white font-medium px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                    Save Course
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <FullScreenLoader show={loading} />
            <h2 className="text-4xl font-[700] px-5 text-blue-950 mb-8">Resources</h2>
            <div className="bg-slate-200 rounded-2xl my-4 px-10 py-2">
                {/* Search Bar with Filters */}
                <div className=" py-4 mb-10 flex lg:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Search courses..."
                        className="grow p-3 border bg-white/70 border-gray-300 rounded-lg shadow-xl shadow-black/25 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <select className="p-3 w-[150px] border bg-white/70 border-gray-300 rounded-lg shadow-xl shadow-black/25 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilter({ ...filter, price: e.target.value })}>
                        <option value="">Price</option>
                        <option value="true">Free</option>
                        <option value="false">Paid</option>
                    </select>
                    <select className="p-3 w-[150px] border bg-white/70 border-gray-300 rounded-lg shadow-xl shadow-black/25 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilter({ ...filter, certification: e.target.value })}>
                        <option value="">Certification</option>
                        <option value="true">With Certification</option>
                        <option value="false">Without Certification</option>
                    </select>
                    <select className="p-3 w-[150px] border bg-white/70 border-gray-300 rounded-lg shadow-xl shadow-black/25 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilter({ ...filter, level: e.target.value })}>
                        <option value="">Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <Section title="Search Results">
                        {searchResults.map((item, index) => (
                            <CourseCard key={index} item={{
                                imgSrc: item.imageSrc,
                                courseSrc: item.courseHref,
                                title: item.courseName,
                                desc: item.description,
                                fullStar: item.starFull,
                                halfStar: item.starHalf,
                                emptyStar: item.starEmpty,
                                duration: item.workload,
                                platform: item.platform
                            }} />
                        ))}
                    </Section>
                )}

                {/* Saved Courses */}
                <Section title="Saved Courses"
                    onSeeAll={() => {
                        getAllCourses();
                        setIsModalOpen(true)
                    }}>
                    {savedTopCourses.length === 0 ? (
                        <p className="text-2xl text-gray-500 font-semibold">No saved courses.</p>
                    ) : (
                        savedTopCourses.map((item, index) => index < 3 ? <CourseCard key={index} item={item} /> : "")
                    )}
                </Section>


                {/* Modal with all saved courses */}
                {isModalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex justify-center items-start pt-20">
                        <FullScreenLoader show={modalLoading} />
                        <div className="bg-white rounded-2xl w-[90%] max-h-[80vh] overflow-y-auto p-6 relative shadow-2xl">
                            <button
                                onClick={() => { setIsModalOpen(false) }}
                                className="absolute top-4 right-6 text-red-500 font-bold text-xl"
                            >
                                ✕
                            </button>
                            <h2 className="text-3xl font-semibold mb-6 text-blue-900">All Saved Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allSavedCourses.length === 0 ? (
                                    <p className="text-xl font-semibold text-gray-600">No courses found.</p>
                                ) : (
                                    allSavedCourses.map((item, index) => (
                                        <CourseCard key={index} item={item} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function Section({ title, children, onSeeAll }) {
    return (
        <div className="mb-10 bg-white/50 rounded-2xl shadow-2xl shadow-black/30">
            <div className="flex justify-between">
                <h4 className="text-2xl font-bold pt-5 px-5 text-gray-800 mb-4">{title}</h4>
                {onSeeAll && (
                    <p onClick={onSeeAll} className="pt-5 pr-10 text-blue-600 text-[18px] cursor-pointer">
                        See all
                    </p>
                )}
            </div>
            <div className="grid-cols-3 grid gap-5 p-5 pt-0 ">
                {children}
            </div>
        </div>
    );
}
