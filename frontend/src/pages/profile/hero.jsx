import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    HiUser, HiBriefcase, HiDocumentText, HiClipboardCheck,
} from "react-icons/hi";
import {
    FaChalkboardTeacher, FaRobot, FaSearch, FaGraduationCap, FaFileAlt,
    FaBriefcase,
} from "react-icons/fa";

export default function HeroPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white min-h-screen flex flex-col  relative overflow-x-hidden">
            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0" />

            {/* ===== Top Navigation ===== */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 bg-opacity-90 backdrop-blur-md w-full flex justify-between items-center py-6 px-6 lg:px-24 shadow-md">

                <div
                    className="text-2xl font-bold text-yellow-400 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    CareerBuddy 🚀
                </div>
                <div className="flex gap-6 text-white font-medium">
                    <button onClick={() => navigate("/profile")} className="cursor-pointer hover:text-yellow-300">Profile</button>
                    <button onClick={() => navigate("/jobs/matchResults")} className="cursor-pointer hover:text-yellow-300">Match Jobs</button>
                    <button onClick={() => navigate("/resume/builder")} className="cursor-pointer hover:text-yellow-300">Build Resume</button>
                    <button onClick={() => navigate("/learning/resources")} className="cursor-pointer hover:text-yellow-300">Explore Courses</button>
                </div>
            </nav>

            {/* ===== Hero Section ===== */}
            <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between mt-36 lg:mt-40 gap-12 px-6 lg:px-24">
                <div className="max-w-2xl text-center lg:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Your Dream Job Starts <span className="text-yellow-400">Here</span>.
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Discover your ideal job role, bridge skill gaps with AI-picked learning paths,
                        and land interviews faster with ATS-friendly resumes. All in one platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button
                            onClick={() => navigate("/auth/signup")}
                            className="cursor-pointer bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition"
                        >
                            Get Started - It's Free
                        </button>
                    </div>
                </div>

                <div className="max-w-xl w-full">
                    <img
                        src="hero.svg"
                        alt="Hero Illustration"
                        className="w-full object-contain rounded-2xl"
                    />
                </div>
            </div>

            {/* ===== Zigzag Tree Section ===== */}
            <ZigzagTree />

            {/* ===== Step-by-Step Section ===== */}
            <div className="relative z-10 mt-20 mb-20 max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    🚀 Your Path to a Job – <span className="text-yellow-400">Step by Step</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <FeatureStep
                            icon={<HiUser size={28} />}
                            title="1. Create Your Profile"
                            desc="Tell us about your skills, education, certifications, and experiences."
                        />
                        <FeatureStep
                            icon={<HiBriefcase size={28} />}
                            title="2. Match with Jobs"
                            desc="Our AI scans your profile to recommend job roles that suit you best."
                        />
                        <FeatureStep
                            icon={<FaChalkboardTeacher size={26} />}
                            title="3. Fill Skill Gaps"
                            desc="Find top-rated free & paid courses based on your missing skills."
                        />
                    </div>
                    <div className="space-y-8">
                        <FeatureStep
                            icon={<HiDocumentText size={28} />}
                            title="4. Build Your Resume"
                            desc="Generate ATS-friendly resumes tailored to your dream job."
                        />
                        <FeatureStep
                            icon={<FaRobot size={26} />}
                            title="5. Optimize with AI"
                            desc="Upload a job description and let AI improve your resume’s match."
                        />
                        <FeatureStep
                            icon={<HiClipboardCheck size={28} />}
                            title="6. Apply with Confidence"
                            desc="Track saved jobs, download optimized resumes, and land interviews."
                        />
                    </div>
                </div>
            </div>

            {/* ===== Footer ===== */}
            <footer className="bg-white/10 text-white mt-auto py-10 px-4 lg:px-24 text-center text-sm w-full">
                <p>&copy; {new Date().getFullYear()} CareerMate. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-4 text-white/70">
                    <a href="/privacy" className="hover:text-yellow-300">Privacy Policy</a>
                    <a href="/terms" className="hover:text-yellow-300">Terms of Service</a>
                    <a href="/contact" className="hover:text-yellow-300">Contact</a>
                </div>
            </footer>
        </div>
    );
}

// === Feature Step Card ===
function FeatureStep({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4 bg-white/10 p-5 rounded-xl shadow-md hover:bg-white/20 transition">
            <div className="text-yellow-300">{icon}</div>
            <div>
                <h4 className="text-lg font-semibold mb-1">{title}</h4>
                <p className="text-sm text-white/90">{desc}</p>
            </div>
        </div>
    );
}

// === Zigzag Tree Section ===
function ZigzagTree() {
    const features = [
        {
            icon: <FaSearch size={28} className="text-yellow-400" />,
            title: "Smart Job Role Matching",
            description: "AI scans your profile and suggests best-fit roles with clear skill gaps to close.",
        },
        {
            icon: <FaBriefcase size={28} className="text-yellow-400" />,
            title: "Explore Live Job Vacancies",
            description: "Browse real-time job openings from top companies, tailored to your skills and preferences. Save, track, and apply — all in one place.",
        },
        {
            icon: <FaGraduationCap size={28} className="text-yellow-400" />,
            title: "Personalized Learning",
            description: "Get curated courses from top platforms to skill up quickly, efficiently, and affordably.",
        },
        {
            icon: <FaFileAlt size={28} className="text-yellow-400" />,
            title: "ATS-Optimized Resumes",
            description: "Generate job-tailored resumes using AI with tips to beat resume scanners and get seen.",
        },
    ];

    return (
        <div className="z-10 max-w-6xl mx-auto mt-32 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                🌿 How CareerMate Works <span className="text-yellow-400">with AI</span>
            </h2>
            <div className="relative">
                {/* Vertical Line in the Center */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-400 z-0" />

                <div className="relative z-10 space-y-10">
                    {features.map((feature, index) => {
                        const isRight = index % 2 !== 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: isRight ? 80 : -80 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className={`flex items-center justify-center ${isRight ? "flex-row-reverse translate-x-[245px]" : "flex-row translate-x-[-245px]"}`}
                            >
                                {/* === Card === */}
                                <div className="bg-white/10 py-10 px-6 w-full max-w-md rounded-xl shadow-lg backdrop-blur-md">
                                    <div className="flex items-center gap-3 mb-4">
                                        {feature.icon}
                                        <h4 className="text-xl font-semibold text-yellow-300">{feature.title}</h4>
                                    </div>
                                    <p className="text-white/90 text-base leading-relaxed">{feature.description}</p>
                                </div>

                                {/* Horizontal Line */}
                                <div className="h-1 w-10 bg-yellow-400" />

                                {/* Dot that touches vertical line */}
                                <div className="relative">
                                    <div className="h-5 w-5 bg-yellow-400 rounded-full border-4 border-white z-20" />
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
