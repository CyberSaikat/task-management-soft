import { FaHome, FaTasks, FaUserFriends, FaChartPie, FaCogs, FaBell } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md'; // For individual task icon
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MenuItems } from "@/abstract/interface"; // For adding users

const menuItems: MenuItems[] = [
    // Home
    {
        icon: FaHome,
        label: "Home",
        href: "dashboard",
        permissions: ["admin", "user"],
    },
    // Task List
    {
        icon: FaTasks,
        label: "Task List",
        href: "task-list",
        permissions: ["admin", "user"],
    }, {
        icon: FaTasks,
        label: "Task",
        href: "task",
        permissions: ["admin", "user"],
    },
    // Individual Tasks
    {
        icon: MdAssignment,
        label: "My Tasks",
        href: "my-tasks",
        permissions: ["user"],
    },
    // User Management
    {
        icon: FaUserFriends,
        label: "Users",
        href: "users",
        permissions: ["admin"],
    },
    // Task Statistics
    {
        icon: FaChartPie,
        label: "Statistics",
        href: "statistics",
        permissions: ["admin", "user"],
    },
];

export default menuItems;
