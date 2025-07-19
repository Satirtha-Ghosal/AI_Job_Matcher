import { Outlet } from "react-router-dom";
import { useState } from "react";

import SideNavbar from "./sideNavbar";

export default function Template(){

    const [iscollapse, setIsCollapse] = useState(true);

    return(
        <div>
            <SideNavbar iscollapse={iscollapse} setIsCollapse={setIsCollapse} />
            <div className={`transition-all ${iscollapse? "ml-25": "ml-80"}`}>
            <Outlet/>
            </div>
        </div>
    )
}