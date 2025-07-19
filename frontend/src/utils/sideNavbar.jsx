import { CgProfile } from "react-icons/cg";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
import { MdWork } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { FaBookReader } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { RiLogoutBoxLine } from "react-icons/ri";

import { toast } from 'react-toastify';

import { NavLink } from "react-router";

import { useNavigate } from "react-router";


export default function SideNavbar(props) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear JWT
        toast.success("Logged out successfully");
        navigate("auth/login"); // Redirect to login
    };

    function collapseBar() {
        props.setIsCollapse(!props.iscollapse)
        console.log(props.iscollapse)
    }

    const list = [
        { name: "Profile", icon: <CgProfile />, to: "profile" },
        { name: "Job Matcher", icon: <MdWork />, to: "jobs/matchResults" },
        { name: "Resources", icon: <FaBookReader />, to: "learning/resources" },
        { name: "Resume", icon: <GrDocumentUser />, to: "resume/builder" }
    ]

    return (
        <>
            <nav className={`bg-slate-900 h-screen rounded-tr-3xl rounded-br-3xl fixed transition-all ${props.iscollapse ? "w-25" : "w-80"}`}>
                <div className="text-white">
                    <div className={`${props.iscollapse ? "pt-16" : ""} p-6`}>
                        <CgProfile className={`  mb-4 cursor-pointer text-5xl`} />
                        <span className={`${props.iscollapse ? "hidden" : ""} font-extrabold text-4xl text-nowrap`}>Hey there</span>
                    </div>
                    {!props.iscollapse ? <TbLayoutSidebarLeftCollapseFilled className=" text-4xl absolute top-5 right-0 cursor-pointer" onClick={collapseBar} /> :
                        <TbLayoutSidebarRightCollapseFilled className="text-4xl absolute top-5 right-0 cursor-pointer" onClick={collapseBar} />}
                </div>
                <div className="mt-5 text-xl pl-6 pr-5">
                    <div className=" text-white flex flex-col gap-2">
                        {list.map((item, index) => {
                            return (
                                <NavLink key={index} to={item.to} className={({ isActive }) =>
                                    `flex p-4 rounded-2xl gap-5 items-center cursor-pointer text-nowrap whitespace-nowrap ${isActive ? "bg-slate-600 text-white" : "bg-slate-800 text-white"
                                    }`
                                }><span className="text-3xl">{item.icon}</span> {!props.iscollapse ? item.name : ""}</NavLink>
                            )
                        })}
                    </div>
                </div>
                <div onClick={handleLogout} className="text-white pb-5 pl-10 pr-5 flex gap-5 items-center text-2xl absolute bottom-0 cursor-pointer">
                    <span className="text-3xl" >{<RiLogoutBoxLine />}</span>{!props.iscollapse ? <span>Logout</span> : ""}
                </div>
            </nav>
        </>
    )
}