import {
    LuLayoutDashboard,
    LuLogOut,
} from 'react-icons/lu';

import {
    AiOutlineBarChart   
} from "react-icons/ai";

import {
    RiMessage2Line     
} from "react-icons/ri";

import { MdGpsFixed } from "react-icons/md";
import { MdFeedback } from "react-icons/md";



export const SIDE_MENU_DATA =[
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id:"02",
        label:"Analysis",
        icon: AiOutlineBarChart  ,
        path: "/analysis",
    },
    {
        id:"03",
        label:"Messager",
        icon:RiMessage2Line  ,
        path: "/messager",
    },
    {
        id:"04",
        label:"Feedback",
        icon:MdFeedback,
        path: "/feedback"
    },
    {
        id:"06",
        label:"Logout",
        icon:LuLogOut,
        path: "/logout",
    },
];
export const SIDE_MENU_ADMIN_DATA =[
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id:"02",
        label:"Analysis",
        icon: AiOutlineBarChart  ,
        path: "/analysis",
    },
    {
        id:"03",
        label:"Messager",
        icon:RiMessage2Line  ,
        path: "/messager",
    },
    {
        id:"04",
        label:"Tracker",
        icon:MdGpsFixed,
        path:"/tracker"
    },
    {
        id:"05",
        label:"Feedback",
        icon:MdFeedback,
        path: "/feedback"
    },
    {
        id:"06",
        label:"Logout",
        icon:LuLogOut,
        path: "/logout",
    },
];
