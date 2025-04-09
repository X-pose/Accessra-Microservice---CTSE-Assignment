import React, { useState, useEffect } from "react";
import logo from "/Logo.png";

const users = [
    {
        name: "falcon",
        email: "falconmail@gmail.com",
        role: "Administrator",
        status: "Active",
    },
    {
        name: "eagle",
        email: "eaglemail@gmail.com",
        role: "Reader",
        status: "Inactive",
    },
    {
        name: "hawk",
        email: "hawkmail@gmail.com",
        role: "Contributor",
        status: "Active",
    },
    {
        name: "sparrow",
        email: "sparrowmail@gmail.com",
        role: "Reader",
        status: "Active",
    },
    {
        name: "owl",
        email: "owlmail@gmail.com",
        role: "Administrator",
        status: "Inactive",
    },
    {
        name: "robin",
        email: "robinmail@gmail.com",
        role: "Contributor",
        status: "Active",
    },
    {
        name: "dove",
        email: "dovemail@gmail.com",
        role: "Reader",
        status: "Active",
    },
    {
        name: "crow",
        email: "crowmail@gmail.com",
        role: "Administrator",
        status: "Active",
    },
    {
        name: "peacock",
        email: "peacockmail@gmail.com",
        role: "Contributor",
        status: "Inactive",
    },
    {
        name: "parrot",
        email: "parrotmail@gmail.com",
        role: "Reader",
        status: "Active",
    },
]

const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState("Privilege Matrix");
    const [selectedRole, setSelectedRole] = useState("Administrator");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNewUserDrawer, setIsNewUSerDrawer] = useState(false);
    const [isNewResourceDrawer, setIsNewResourceDrawer] = useState(false);

    const [userName, setUserName] = useState("falcon");

    const [privileges, setPrivileges] = useState({
        roles: ["Administrator", "Reader", "Contributor"],
        modules: [
            "Product page",
            "Admin page",
            "User Management page",
            "Core Data page",
            "Core Data Category",
            "Templates",
            "Privilege Matrix",
            "General",
        ],
        permissions: {}, // This will be initialized in useEffect
    });

    // Initialize permissions structure
    useEffect(() => {
        const initialPermissions = {};

        // Set default permissions based on role
        privileges.roles.forEach((role) => {
            privileges.modules.forEach((module) => {
                // Default permissions - Administrator gets all permissions by default
                const isAdmin = role === "Administrator";
                const isReader = role === "Reader";

                initialPermissions[`${role}-${module}`] = {
                    view: isAdmin || isReader, // Reader can view
                    create: isAdmin,  // Only admin can create
                    edit: isAdmin,    // Only admin can edit
                    delete: isAdmin,  // Only admin can delete
                };
            });
        });

        setPrivileges((prev) => ({ ...prev, permissions: initialPermissions }));
    }, []);

    const togglePermission = (role, module, permission) => {
        setPrivileges((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [`${role}-${module}`]: {
                    ...prev.permissions[`${role}-${module}`],
                    [permission]: !prev.permissions[`${role}-${module}`]?.[permission],
                },
            },
        }));
        console.log(privileges.permissions);
    };

    const removeUser = (index) => {
        // Logic to remove user from the list
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Sidebar */}
            <div className="w-1/6 bg-white shadow-md">
                <div className="p-4 text-xl font-bold text-blue-900">
                    <img src={logo} alt="logo" className="object-cover h-8" />
                </div>
                <ul className="mt-4">
                    <li
                        className={`p-4 cursor-pointer ${activeMenu === "User Management"
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-700"
                            }`}
                        onClick={() => setActiveMenu("User Management")}
                    >
                        <div className="flex">
                            <i className="fa-solid fa-users text-lg mr-2"></i>
                            <p>User Management</p>
                        </div>
                    </li>
                    <li
                        className={`p-4 cursor-pointer ${activeMenu === "Privilege Matrix"
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-700"
                            }`}
                        onClick={() => setActiveMenu("Privilege Matrix")}
                    >
                        <div className="flex">
                            <i className="fa-solid fa-sliders text-lg mr-2 rotate-90"></i>
                            <p>Privilege Matrix</p>
                        </div>
                    </li>
                    {/* <li
            className={`p-4 cursor-pointer ${
              activeMenu === "Settings"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
            onClick={() => setActiveMenu("Settings")}
          >
            <div className="flex">
              <i className="fa-solid fa-gear text-lg mr-2"></i>
              <p>Settings</p>
            </div>
          </li> */}
                </ul>
            </div>

            {/* Right Content */}
            <div className="w-full flex flex-col relative justify-center items-center p-6">
                <div className="bg-white absolute px-[20px] top-0 w-full h-[70px] shadow-sm flex items-center justify-end">
                    <div className=" flex items-center justify-center bg-gray-400 px-2 py-1.5 rounded-full">
                        <div className="bg-white mr-[10px] w-[30px] h-[30px] flex justify-center items-center rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
                            <i className="fa-solid fa-user text-1xl text-gray-500"></i>
                        </div>
                        <p className="font-semibold text-white">{userName}</p>
                        <i className="fa-solid fa-chevron-down text-lg text-white mx-2"></i>

                    </div>

                </div>

                {activeMenu === "User Management" && (
                    <div className="w-4/5">
                        <div className="flex w-full justify-between">
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-[var(--accent)] mb-4">
                                    User Management
                                </h2>
                            </div>
                            <div>
                                <button onClick={() => setIsNewUSerDrawer(true)} className=" cursor-pointer bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Create New User
                                </button>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-100 border-b border-gray-300">
                                        <th className="text-left p-2  border-gray-300">User Name</th>
                                        <th className="text-left p-2 border-l border-gray-300">Email</th>
                                        <th className="text-left p-2 border-l border-gray-300">Role</th>
                                        <th className="text-left p-2 border-l border-gray-300">Status</th>
                                        <th className="text-left p-2 border-l border-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Sample Data */}
                                    {users.map((user, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border-b text-gray-500 border-gray-300">{user?.name}</td>
                                            <td className="p-2 border-b border-l border-gray-300 text-gray-500">{user?.email.toLowerCase()}</td>
                                            <td className="p-2 border-b border-l border-gray-300 text-gray-500">{user?.role}</td>
                                            <td className={`p-2 border-b border-l border-gray-300 text-gray-500 text-center `}><div className={` rounded-md ${user?.status == 'Active' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{user?.status}</div></td>
                                            <td className="p-2 border-b border-l border-gray-300 text-gray-500">
                                                <div className="flex justify-center">
                                                    <i className="fa-solid fa-pen-to-square mr-[20px] text-gray-300 hover:text-[var(--accent)] cursor-pointer"></i>
                                                    <i onClick={() => removeUser(index)} className="fa-solid fa-trash text-gray-300 hover:text-red-400 cursor-pointer"></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}


                {activeMenu === "Privilege Matrix" && (
                    <div className="w-4/5">
                        <div className="flex w-full justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                                    Privilege Matrix
                                </h2>
                            </div>
                            <div>
                                <button onClick={() => setIsDrawerOpen(true)} className=" cursor-pointer bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Create New User Role
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* User Roles */}
                            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-bold mb-2 bg-blue-100 p-2">User Roles</h3>
                                <ul>
                                    {privileges.roles.map((role, index) => (
                                        <li
                                            key={index}
                                            className={`p-2 border-b border-gray-300 last:border-b-0  cursor-pointer ${selectedRole === role
                                                ? "bg-[var(--accent)] text-white font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            onClick={() => setSelectedRole(role)}

                                        >
                                            {role}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Privilege Matrix */}
                            <div className="w-3/4 bg-white p-4 rounded-lg shadow-md">

                                <table className="w-full ">
                                    <thead>
                                        <tr className="bg-blue-100 border-b border-gray-300">
                                            <th className="text-left p-2 ">Modules/Screen</th>
                                            <th className="text-center p-2 border-l border-gray-300">View</th>
                                            <th className="text-center p-2 border-l border-gray-300">Create</th>
                                            <th className="text-center p-2 border-l border-gray-300">Edit</th>
                                            <th className="text-center p-2 border-l border-gray-300">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {privileges.modules.map((module, moduleIndex) => (
                                            <tr key={moduleIndex}>
                                                <td className="p-2 border-b text-gray-500 border-gray-300 ">{module}</td>
                                                {["view", "create", "edit", "delete"].map(
                                                    (permission, permIndex) => (
                                                        <td className="p-2 border-b border-gray-300 border-l border-gray-300 text-center" key={permIndex}>
                                                            <input
                                                                type="checkbox"
                                                                className="bg-[var(--accent)] cursor-pointer"
                                                                checked={
                                                                    privileges.permissions[`${selectedRole}-${module}`]?.[
                                                                    permission
                                                                    ] || false
                                                                }
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        selectedRole,
                                                                        module,
                                                                        permission
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button onClick={() =>setIsNewResourceDrawer(true)} className="bg-[var(--accent)] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Create New Resource
                            </button>
                            <button className="bg-[var(--accent)] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isDrawerOpen && (
                <div className="fixed h-full inset-0 bg-black opacity-20 z-40" onClick={() => setIsDrawerOpen(false)}></div>
            )}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300`}
            >
                <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Create New User Role</h3>
                        <button
                            className="text-[var(--accent)] text-3xl cursor-pointer"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                    <form className="flex flex-col h-full justify-between">
                        <div className="mb-4">
                            <label
                                htmlFor="userRole"
                                className="block text-sm font-medium text-gray-700"
                            >
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="userRole"
                                placeholder="Enter User Role Name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-center w-full gap-4">
                            <button
                                type="button"
                                className="bg-gray-500 cursor-pointer w-1/4 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer bg-[var(--accent)] w-3/4 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isNewUserDrawer && (
                <div className="fixed h-full inset-0 bg-black opacity-20 z-40" onClick={() => setIsNewUSerDrawer(false)}></div>
            )}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform ${isNewUserDrawer ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300`}
            >
                <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Create New User Role</h3>
                        <button
                            className="text-[var(--accent)] text-3xl cursor-pointer"
                            onClick={() => setIsNewUSerDrawer(false)}
                        >
                            &times;
                        </button>
                    </div>
                    <form className="flex flex-col h-full justify-between">
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    User Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userRole"
                                    placeholder="Enter User Role Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="usereEmail"
                                    placeholder="Enter User Email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    User Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="userRole"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled selected>
                                        Select a Role
                                    </option>
                                    {privileges.roles.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center w-full gap-4">
                            <button
                                type="button"
                                className="bg-gray-500 cursor-pointer w-1/4 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsNewUSerDrawer(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer bg-[var(--accent)] w-3/4 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        
            {isNewResourceDrawer && (
                <div className="fixed h-full inset-0 bg-black opacity-20 z-40" onClick={() => setIsNewResourceDrawer(false)}></div>
            )}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform ${isNewResourceDrawer ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300`}
            >
                <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Create New Resource</h3>
                        <button
                            className="text-[var(--accent)] text-3xl cursor-pointer"
                            onClick={() => setIsNewResourceDrawer(false)}
                        >
                            &times;
                        </button>
                    </div>
                    <form className="flex flex-col h-full justify-between">
                        <div className="mb-4">
                            <label
                                htmlFor="userRole"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Resource Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="Resource"
                                placeholder="Enter Resource Name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-center w-full gap-4">
                            <button
                                type="button"
                                className="bg-gray-500 cursor-pointer w-1/4 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsNewResourceDrawer(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer bg-[var(--accent)] w-3/4 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;