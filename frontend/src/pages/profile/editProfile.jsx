import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router";

import FullScreenLoader from "../../utils/fullScreenLoader";

import { toast } from 'react-toastify';

export default function EditProfile() {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        "firstname": "",
        "lastname": "",
        "dob": "",
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "languages": [""],
        "developer_tools": [""],
        "tech_stack": [""],
        "miscellaneous": [""],
        "soft_skills": [""],
        "experience": [{ title: "", company: "", duration: "", description: "" }],
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
                    navigate(".././auth/login");
                    return;
                }
                isLoading(true);
                const res = await fetch('http://localhost:3000/api/userInfo/getUserInfo', {
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
                const data = await res.json()
                if (res.ok) {
                    setUserInfo(data)
                }
                else {
                    toast.error("Error Fetching Profile Data !!! Refresh The Page")
                }
            } catch (error) {
                toast.error("Error Fetching Profile Data !!! Refresh The Page")
                console.error("Error fetching user info:", error);
            }
            finally {
                isLoading(false);
            }
        }

        fetchData();

    }, [])

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        personal: {
            firstName: userInfo.firstname,
            lastName: userInfo.lastname,
            dob: formatDate(userInfo.dob),
        },
        contact: {
            email: userInfo.email,
            phone: userInfo.phone,
            linkedin: userInfo.linkedin,
            github: userInfo.github,
            portfolio: userInfo.portfolio
        },
        skills: {
            languages: userInfo.languages,
            tools: userInfo.developer_tools,
            techStack: userInfo.tech_stack,
            misc: userInfo.miscellaneous,
            softSkills: userInfo.soft_skills
        },
        experience: userInfo.experience,
        education: userInfo.education,
        projects: userInfo.projects,
        certificates: userInfo.certificates
    });

    useEffect(() => {
        setFormData({
            personal: {
                firstName: userInfo.firstname,
                lastName: userInfo.lastname,
                dob: formatDate(userInfo.dob),
            },
            contact: {
                email: userInfo.email,
                phone: userInfo.phone,
                linkedin: userInfo.linkedin,
                github: userInfo.github,
                portfolio: userInfo.portfolio
            },
            skills: {
                languages: userInfo.languages,
                tools: userInfo.developer_tools,
                techStack: userInfo.tech_stack,
                misc: userInfo.miscellaneous,
                softSkills: userInfo.soft_skills
            },
            experience: userInfo.experience,
            education: userInfo.education,
            projects: userInfo.projects,
            certificates: userInfo.certificates
        });
    }, [userInfo]);


    const [openSections, setOpenSections] = useState({ "Personal Information": true });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleInputChange = (header, key, value) => {
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;

            current[header][key] = value;

            return current;
        });
        console.log(formData)
    };


    const updateSkillItem = (skillType, index, value) => {
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;
            current["skills"][skillType][index] = value;

            console.log(current);
            return current;
        });
        console.log(formData)
    };


    const addSkillItem = (skillType) => {
        setFormData((prev) => ({
            ...prev,
            skills: {
                ...prev.skills,
                [skillType]: [...prev.skills[skillType], ""]
            }
        }));
    };

    const handleDynamicChange = (section, index, field, value) => {
        const updatedSection = [...formData[section]];
        updatedSection[index][field] = value;
        setFormData({ ...formData, [section]: updatedSection });
    };

    const addDynamicField = (section, template) => {
        setFormData({
            ...formData,
            [section]: [...formData[section], { ...template }]
        });
    };

    const updateProjectArrayItem = (index, field, subIndex, value) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field][subIndex] = value;
        setFormData({ ...formData, projects: updatedProjects });
    };

    const addProjectArrayItem = (index, field) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field].push("");
        setFormData({ ...formData, projects: updatedProjects });
    };

    const removeSkillItem = (skillType, index) => {
        setFormData(prev => {
            const updated = [...prev.skills[skillType]];
            updated.splice(index, 1);
            return {
                ...prev,
                skills: {
                    ...prev.skills,
                    [skillType]: updated
                }
            };
        });
    };

    const removeDynamicField = (section, index) => {
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection.splice(index, 1);
            return {
                ...prev,
                [section]: updatedSection
            };
        });
    };

    const removeProjectArrayItem = (index, field, subIndex) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field].splice(subIndex, 1);
        setFormData({ ...formData, projects: updatedProjects });
    };


    const sanitizeData = (data) => {
        const isObjectEmpty = (obj) =>
            Object.values(obj).every((val) =>
                Array.isArray(val) ? val.length === 0 || val.every(item => !item) : !val
            );

        const removeDuplicatesFromArray = (arr) =>
            Array.from(new Set(arr.filter(item => item && item.trim() !== "")));

        const removeDuplicateObjects = (arr) => {
            const seen = new Set();
            return arr.filter(item => {
                const str = JSON.stringify(item);
                if (seen.has(str)) return false;
                seen.add(str);
                return true;
            });
        };

        const cleaned = {
            ...data,
            languages: removeDuplicatesFromArray(data.languages),
            developer_tools: removeDuplicatesFromArray(data.developer_tools),
            tech_stack: removeDuplicatesFromArray(data.tech_stack),
            miscellaneous: removeDuplicatesFromArray(data.miscellaneous),
            soft_skills: removeDuplicatesFromArray(data.soft_skills),
            experience: removeDuplicateObjects(data.experience).filter(e => !isObjectEmpty(e)),
            education: removeDuplicateObjects(data.education).filter(e => !isObjectEmpty(e)),
            projects: removeDuplicateObjects(data.projects.map(p => ({
                ...p,
                techstack: removeDuplicatesFromArray(p.techstack),
                feature: removeDuplicatesFromArray(p.feature)
            }))).filter(p => !isObjectEmpty(p)),
            certificates: removeDuplicateObjects(data.certificates).filter(c => !isObjectEmpty(c))
        };

        return cleaned;
    };

    const submitform = async () => {
        // console.log(formData)

        const rawPayload = {
            "firstname": formData.personal.firstName,
            "lastname": formData.personal.lastName,
            "dob": formData.personal.dob,
            "email": formData.contact.email,
            "phone": formData.contact.phone,
            "linkedin": formData.contact.linkedin,
            "github": formData.contact.github,
            "portfolio": formData.contact.portfolio,
            "languages": formData.skills.languages,
            "developer_tools": formData.skills.tools,
            "tech_stack": formData.skills.techStack,
            "miscellaneous": formData.skills.misc,
            "soft_skills": formData.skills.softSkills,
            "experience": formData.experience,
            "education": formData.education,
            "projects": formData.projects,
            "certificates": formData.certificates
        }

        const payload = sanitizeData(rawPayload)


        try {
            console.log(payload)
            const token = localStorage.getItem("token");
            console.log(token)
            if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
            isLoading(true);
            console.log("Final Info", payload);
            const res = await fetch('http://localhost:3000/api/userInfo/updateUserInfo', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
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
                toast.success("Profile Updated Succesfully !!!")
            }
            else {
                toast.error("Something Went Wrong!!! Try Again")
            }

        } catch (error) {
            console.error("Error submitting user info:", error);
            toast.error("Something Went Wrong!!! Try Again")
        } finally {
            isLoading(false)
        }

    }


    const personalInfo =
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">First Name</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" placeholder="First Name" value={formData.personal.firstName} onChange={(e) => handleInputChange("personal", "firstName", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">Last Name</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" placeholder="Last Name" value={formData.personal.lastName} onChange={(e) => handleInputChange("personal", "lastName", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">Date of Birth</p>
                <input className="input border-2 py-3 px-5 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 w-fit" type="date" placeholder="DOB" value={formData.personal.dob} onChange={(e) => handleInputChange("personal", "dob", e.target.value)} />
            </div>

        </div>

    const contacts =
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">Email</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" type="email" placeholder="Email" value={formData.contact.email} onChange={(e) => handleInputChange("contact", "email", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">Phone Number</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" type="tel" placeholder="Phone" value={formData.contact.phone} onChange={(e) => handleInputChange("contact", "phone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">LinkedIn</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" type="url" placeholder="LinkedIn" value={formData.contact.linkedin} onChange={(e) => handleInputChange("contact", "linkedin", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">GitHub</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" type="url" placeholder="GitHub" value={formData.contact.github} onChange={(e) => handleInputChange("contact", "github", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl font-[600] px-2">Portfolio</p>
                <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15 max-w-90" type="url" placeholder="Portfolio" value={formData.contact.portfolio} onChange={(e) => handleInputChange("contact", "portfolio", e.target.value)} />
            </div>

        </div>

    const skills =
        <div>
            {Object.entries(formData.skills).map(([key, values]) => (
                <div className="flex flex-col gap-2 my-4" key={key}>
                    <label className="font-[600] px-2 text-xl capitalize">{key}</label>
                    <div className="flex gap-3 flex-wrap">
                        {values.map((val, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input
                                    value={val}
                                    placeholder={`Enter ${key}`}
                                    onChange={(e) => updateSkillItem(key, idx, e.target.value)}
                                    className="input border-2 p-2 border-indigo-400/30 rounded-2xl bg-white/15"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSkillItem(key, idx)}
                                    className="text-red-500 font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button className="border-2 w-[50px] border-indigo-400/30 rounded-2xl bg-white/50 p-2 cursor-pointer" onClick={() => addSkillItem(key)}>+</button>
                    </div>
                </div>
            ))}
        </div>

    const education =
        <div className="flex flex-col gap-6">

            {formData.education.map((entry, idx) => (
                <>
                    <button
                        className="text-red-500 font-bold self-end cursor-pointer"
                        onClick={() => removeDynamicField("education", idx)}
                    >
                        × Remove
                    </button>
                    <div key={idx} className="grid lg:grid-cols-2 grid-cols-1 gap-5 border border-white/80 p-5 rounded-2xl drop-shadow-xl bg-white/10">
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Level</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Level" value={entry.level} onChange={(e) => handleDynamicChange("education", idx, "level", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Institution</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Institution" value={entry.institution} onChange={(e) => handleDynamicChange("education", idx, "institution", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Percentage</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Percentage" value={entry.percentage_point} onChange={(e) => handleDynamicChange("education", idx, "percentage_point", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Duration</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Duration" value={entry.duration} onChange={(e) => handleDynamicChange("education", idx, "duration", e.target.value)} />
                        </div>
                    </div>
                </>
            ))}
            <button className="border-2 border-indigo-400/30 rounded-2xl bg-white/50 p-2 w-fit self-start cursor-pointer" onClick={() => addDynamicField("education", { level: "", institution: "", percentage_point: "", duration: "" })}>
                + Add Education
            </button>
        </div>

    const experience =
        <div className="flex flex-col gap-6">
            {formData.experience.map((entry, idx) => (
                <>
                    <button
                        className="text-red-500 font-bold self-end cursor-pointer"
                        onClick={() => removeDynamicField("experience", idx)}
                    >
                        × Remove
                    </button>
                    <div key={idx} className="grid lg:grid-cols-2 grid-cols-1 gap-5 border border-white/80 p-5 rounded-2xl drop-shadow-xl bg-white/10">
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Title</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Title" value={entry.title} onChange={(e) => handleDynamicChange("experience", idx, "title", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Organization</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Organization" value={entry.company} onChange={(e) => handleDynamicChange("experience", idx, "company", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Duration</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Duration" value={entry.duration} onChange={(e) => handleDynamicChange("experience", idx, "duration", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Description</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Description" value={entry.description} onChange={(e) => handleDynamicChange("experience", idx, "description", e.target.value)} />
                        </div>
                    </div>
                </>
            ))}
            <button className="border-2 border-indigo-400/30 rounded-2xl bg-white/50 p-2 w-fit self-start cursor-pointer" onClick={() => addDynamicField("experience", { title: "", company: "", duration: "", description: "" })}>
                + Add Experience
            </button>
        </div>


    const projects =
        <div className="flex flex-col gap-6">
            {formData.projects.map((proj, idx) => (
                <>
                    <button
                        className="text-red-500 font-bold self-end cursor-pointer"
                        onClick={() => removeDynamicField("projects", idx)}
                    >
                        × Remove
                    </button>
                    <div key={idx} className="grid lg:grid-cols-2 grid-cols-1 gap-5 border border-white/80 p-5 rounded-2xl drop-shadow-xl bg-white/10">
                        <div className="flex flex-col gap-2 lg:col-span-1">
                            <p className="text-xl font-[600] px-2">Title</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Title" value={proj.title} onChange={(e) => handleDynamicChange("projects", idx, "title", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <p className="text-xl font-[600] px-2">About</p>
                            <textarea className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="About" value={proj.about} onChange={(e) => handleDynamicChange("projects", idx, "about", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Tech Stack</p>
                            <div className="flex flex-wrap gap-3">
                                {proj.techstack.map((item, techIdx) => (
                                    <div key={techIdx} className="flex items-center gap-2">
                                        <input
                                            value={item}
                                            placeholder="Tech Stack"
                                            onChange={(e) =>
                                                updateProjectArrayItem(idx, "techstack", techIdx, e.target.value)
                                            }
                                            className="input border-2 p-2 border-indigo-400/30 rounded-2xl bg-white/15"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProjectArrayItem(idx, "techstack", techIdx)}
                                            className="text-red-500 font-bold cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="border-2 w-[50px] border-indigo-400/30 rounded-2xl bg-white/50 p-2 cursor-pointer"
                                    onClick={() => addProjectArrayItem(idx, "techstack")}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <p className="text-xl font-[600] px-2">Features</p>
                            <div className="flex flex-col flex-wrap gap-3">
                                {proj.feature.map((item, featIdx) => (
                                    <div key={featIdx} className="flex items-center gap-2" >
                                        <input
                                            value={item}
                                            placeholder="Feature"
                                            onChange={(e) =>
                                                updateProjectArrayItem(idx, "feature", featIdx, e.target.value)
                                            }
                                            className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProjectArrayItem(idx, "feature", featIdx)}
                                            className="text-red-500 font-bold cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="border-2 max-w-[50px] border-indigo-400/30 rounded-2xl bg-white/50 p-2 cursor-pointer"
                                    onClick={() => addProjectArrayItem(idx, "feature")}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 col-span-1">
                            <p className="text-xl font-[600] px-2">Link</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Link" value={proj.link} onChange={(e) => handleDynamicChange("projects", idx, "link", e.target.value)} />
                        </div>
                    </div>
                </>
            ))}
            <button className="border-2 border-indigo-400/30 rounded-2xl bg-white/50 p-2 w-fit self-start cursor-pointer" onClick={() => addDynamicField("projects", { title: "", about: "", techstack: [""], feature: [""], link: "" })}>
                + Add Project
            </button>
        </div>

    const certificates =
        <div className="flex flex-col gap-6">
            {formData.certificates.map((cert, idx) => (
                <>
                    <button
                        className="text-red-500 font-bold self-end cursor-pointer"
                        onClick={() => removeDynamicField("certificates", idx)}
                    >
                        × Remove
                    </button>
                    <div key={idx} className="grid lg:grid-cols-2 grid-cols-1 gap-5 border border-white/80 p-5 rounded-2xl drop-shadow-xl bg-white/10">
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Title</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Title" value={cert.title} onChange={(e) => handleDynamicChange("certificates", idx, "title", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-[600] px-2">Institution</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Institution" value={cert.institution} onChange={(e) => handleDynamicChange("certificates", idx, "institution", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2 lg:col-span-2">
                            <p className="text-xl font-[600] px-2">Description</p>
                            <textarea className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Description" value={cert.description} onChange={(e) => handleDynamicChange("certificates", idx, "description", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2 lg:col-span-2">
                            <p className="text-xl font-[600] px-2">Link</p>
                            <input className="input border-2 p-2 border-indigo-400/30 rounded-2xl drop-shadow-black bg-white/15" placeholder="Link" value={cert.link} onChange={(e) => handleDynamicChange("certificates", idx, "link", e.target.value)} />
                        </div>
                    </div>
                </>
            ))}
            <button className="border-2 border-indigo-400/30 rounded-2xl bg-white/50 p-2 w-fit self-start cursor-pointer" onClick={() => addDynamicField("certificates", { title: "", institution: "", description: "", link: "" })}>
                + Add Certificate
            </button>
        </div>

    const components = [["Personal Information", personalInfo], ["Contacts", contacts], ["Skills", skills], ["Education", education], ["Experience", experience], ["Projects", projects], ["Certificates", certificates]]

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 lg:p-10">
            <FullScreenLoader show={loading} />

            <h2 className="text-4xl font-extrabold text-blue-950 mb-6">
                Edit Profile
            </h2>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 space-y-6">
                {components.map(([section, component], idx) => (
                    <div key={idx} className="border border-indigo-200 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => toggleSection(section)}
                            className="w-full flex justify-between items-center px-6 py-4 bg-indigo-100 hover:bg-indigo-200 transition cursor-pointer"
                        >
                            <span className="text-xl font-semibold text-indigo-800">{section}</span>
                            {openSections[section] ? (
                                <IoIosArrowUp className="text-indigo-600 text-2xl" />
                            ) : (
                                <IoIosArrowDown className="text-indigo-600 text-2xl" />
                            )}
                        </button>
                        {openSections[section] && <div className="px-6 py-5">{component}</div>}
                    </div>
                ))}

                <button
                    onClick={submitform}
                    className="mt-4 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition"
                >
                    Submit
                </button>
            </div>
        </div>

    );
}
