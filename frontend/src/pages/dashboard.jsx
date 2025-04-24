import React, { useState, useEffect } from "react";
import logo from "/Logo.png";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast, Bounce } from 'react-toastify'

// const users = [
//     {
//         name: "falcon",
//         email: "falconmail@gmail.com",
//         role: "Administrator",
//         status: "Active",
//     },
//     {
//         name: "eagle",
//         email: "eaglemail@gmail.com",
//         role: "Reader",
//         status: "Inactive",
//     },
//     {
//         name: "hawk",
//         email: "hawkmail@gmail.com",
//         role: "Contributor",
//         status: "Active",
//     },
//     {
//         name: "sparrow",
//         email: "sparrowmail@gmail.com",
//         role: "Reader",
//         status: "Active",
//     },
//     {
//         name: "owl",
//         email: "owlmail@gmail.com",
//         role: "Administrator",
//         status: "Inactive",
//     },
//     {
//         name: "robin",
//         email: "robinmail@gmail.com",
//         role: "Contributor",
//         status: "Active",
//     },
//     {
//         name: "dove",
//         email: "dovemail@gmail.com",
//         role: "Reader",
//         status: "Active",
//     },
//     {
//         name: "crow",
//         email: "crowmail@gmail.com",
//         role: "Administrator",
//         status: "Active",
//     },
//     {
//         name: "peacock",
//         email: "peacockmail@gmail.com",
//         role: "Contributor",
//         status: "Inactive",
//     },
//     {
//         name: "parrot",
//         email: "parrotmail@gmail.com",
//         role: "Reader",
//         status: "Active",
//     },
// ]

const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState("User Management");
    const [selectedRole, setSelectedRole] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNewUserDrawer, setIsNewUSerDrawer] = useState(false);
    const [isNewResourceDrawer, setIsNewResourceDrawer] = useState(false);
    const [userRoles, setUserRoles] = useState([])
    const [users, setUsers] = useState(null)
    const [newRole, setNewRole] = useState()
    const [initiateCount, setInitiateCount] = useState(0)
    const [newResource, setNewResource] = useState({
        name: "",
        description: "",
        code: "",
    })
    const [resourceList, setResourceList] = useState([])

    //Add new user states
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleId: "",
    })
    // Add this state at the top of your component
    const [editingId, setEditingId] = useState(null);
    const [userName, setUserName] = useState("falcon");
    const [privilegeMatrix, setPrivileges] = useState({});

    // Initialize permissions structure
    useEffect(() => {
        const initialPermissions = {};
        getUserRoles()
        getAllUsers();
        getAllResources()
        getUserPrivileges()


    }, []);

    useEffect(() => {
        setSelectedRole(userRoles[0])
        setTimeout(() => {
            initiatePrivilegeMatrix()
        }, 1000)
    }, [userRoles]);

    const togglePermission = (role, module, permission) => {
        // setPrivileges((prev) => ({
        //     ...prev,
        //     permissions: {
        //         ...prev.permissions,
        //         [`${role}-${module}`]: {
        //             ...prev.permissions[`${role}-${module}`],
        //             [permission]: !prev.permissions[`${role}-${module}`]?.[permission],
        //         },
        //     },
        // }));
        // console.log(privileges.permissions);
    };

    const addNewRole = async (e) => {
        e.preventDefault();
        const payload = {
            name: newRole,
        }

        const response = await axiosInstance.post('/accessra_microservice/roles', payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(response)
        if (response?.status === 201) {
            await getUserRoles()
            toast.success('User Role Created Successfully!')
            setNewRole('')
            setIsDrawerOpen(false)
        }
    }

    const addNewResource = async (e) => {
        e.preventDefault();
        const payload = {
            name: newResource?.name,
            description: newResource?.description,
            code: newResource?.code,
        }

        const response = await axiosInstance.post('/accessra_microservice/resources', payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(response)
        if (response?.status === 201) {

            await getAllResources()
            toast.success('Resource Created Successfully!')
            setNewResource('')
            setIsNewResourceDrawer(false)
        }
    }

    const getAllResources = async () => {
        const response = await axiosInstance.get('/accessra_microservice/resources', {
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response?.status === 200) {
            setResourceList(response?.data?.resources)
            console.log(response?.data?.resources)
        } else {
            console.log("Error fetching user roles:", response?.status);
        }
    }

    const removeUser = async (index) => {
        // Logic to remove user from the list
        const userId = users[index]?.id;

        const response = await axiosInstance.delete(`/accessra_microservice/users/${userId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response?.status === 200) {
            await getAllUsers()
            toast.success('User Deleted Successfully!')

        } else {
            toast.error('Something went wrong! Try again later!')
        }
    }

    const updateUser = async (index) => {
        // Logic to update user in the list
        const userId = users[index]?.id;

        const payload = {
            firstName: users[index]?.firstName,
            lastName: users[index]?.lastName,
            email: users[index]?.email,
            roleId: users[index]?.roleId,
        }

        console.log("Update payload: ", payload)

        const response = await axiosInstance.patch(`/accessra_microservice/users/${userId}`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response?.status === 200) {
            await getAllUsers()
            toast.success('User Updated Successfully!')
            toggleEdit(null)

        } else {
            toast.error('Something went wrong! Try again later!')
        }
    }

    const createANewuser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jsonwebtoken");
        const decodedToken = jwtDecode(token);

        const payload = {
            firstName: newUser?.firstName,
            lastName: newUser?.lastName,
            email: newUser?.email,
            password: newUser?.password,
            roleId: newUser?.roleId,
            tenantId: decodedToken?.tenantId
        }
        const response = await axiosInstance.post('/accessra_microservice/users', payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response?.status === 201) {
            await getAllUsers()
            toast.success('User Created Successfully!')

        } else {
            toast.error('Something went wrong! Try again later!')
        }
    }

    const getUserRoles = async () => {
        const response = await axiosInstance.get('/accessra_microservice/roles', {
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response?.status === 200) {
            setUserRoles(response?.data)
        } else {
            console.log("Error fetching user roles:", response?.status);
        }
    }
    const getAllUsers = async () => {
        // Logic to fetch all users from the backend
        const userList = await axiosInstance.get('/accessra_microservice/users', {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (userList?.status === 200) {
            setUsers(userList?.data)
        }
    }
    // Add this function to handle edit toggle
    const toggleEdit = (index) => {
        setEditingId(editingId === index ? null : index);
    };

    const getUserPrivileges = async () => {
        const response = await axiosInstance.get('/accessra_microservice/user-privilege-matrix')
        if (response?.status === 200) {
            setPrivileges(response?.data)
        } else {
            console.log("Error fetching privileges:", response?.status);
        }

    }

    const initiatePrivilegeMatrix = async () => {
        if (initiateCount > 0) return
        if (userRoles?.length > 0 && resourceList?.length > 0) {
            for (let i = 0; i < userRoles.length; i++) {
                for (let j = 0; j < resourceList.length; j++) {
                    const privilege = privilegeMatrix.find(p =>
                        p.roleId === userRoles[i]?.id &&
                        p.resourceId === resourceList[j]?.id
                    );

                    // If no privilege found, create a new one
                    if (!privilege) {
                        await createPriviledgeMatrix(userRoles[i]?.id, resourceList[j]?.id)
                    }

                }
            }
            setInitiateCount(1)
        } else {
            console.log("User roles or resources not available to create privilege matrix.");
        }
    }
    const createPriviledgeMatrix = async (roleId, resourceId) => {


        const payload = {
            roleId: roleId,
            resourceId: resourceId,
            create: false,
            edit: false,
            delete: false,
            view: false
        }

        console.log('Creating priviledge matrix:', payload)
        const response = await axiosInstance.post('/accessra_microservice/user-privilege-matrix', payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response?.status === 201) {
            await getUserPrivileges()

        } else {
            console.log("Error creating privilege matrix:", response?.status);
        }
    }

    const checkPermission = (roleId, resourceId, permission) => {
        try {

            // Find the privilege in the matrix that matches both roleId and resourceId
            const privilege = privilegeMatrix.find(p =>
                p.roleId === roleId &&
                p.resourceId === resourceId
            );


            // If no privilege found, return false
            if (!privilege) {


                return false;
            }

            // Return the value of the specific permission (create, edit, delete, view)
            return privilege[permission] || false;

        } catch (error) {
            console.error("Error checking permission:", error);
            return false;
        }
    };

    const updatePermissoins = async (roleId, resourceId, permission) => {
        const privilege = privilegeMatrix.find(p =>
            p.roleId === roleId &&
            p.resourceId === resourceId
        );

        if (!privilege) {
            return false
        }

        const payload = {
            [permission]: !privilege[permission]
        }

        const response = await axiosInstance.patch(`/accessra_microservice/user-privilege-matrix/${roleId}/${resourceId}`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response?.status === 200) {
            await getUserPrivileges()
            toast.success('Privilege Updated Successfully!')
            return privilege[permission]
        } else {
            toast.error('Something went wrong! Try again later!')
        }
    }

    const returnRoleName = (roleId) => {
        const role = userRoles.find((role) => role?.id === roleId);
        return role ? role?.name : "Not Assigned yet";
    }

    return (
        <div className="flex h-screen bg-gray-100">

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

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
                            {users?.length >= 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-blue-100 border-b border-gray-300">
                                            <th className="text-left p-2  border-gray-300">First Name</th>
                                            <th className="text-left p-2 border-l border-gray-300">Last Name</th>
                                            <th className="text-left p-2 border-l border-gray-300">Email</th>
                                            <th className="text-left p-2 border-l border-gray-300">Role</th>
                                            {/* <th className="text-left p-2 border-l border-gray-300">Status</th> */}
                                            <th className="text-left p-2 border-l border-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Sample Data */}
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border-b text-gray-500 border-gray-300">
                                                    {editingId === index ? (
                                                        <input
                                                            type="text"
                                                            defaultValue={user?.firstName}
                                                            onChange={(e) => setUsers((prev) => {
                                                                const users = [...prev]; users[index].firstName = e.target.value;
                                                                return users
                                                            })}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        user?.firstName
                                                    )}
                                                </td>
                                                <td className="p-2 border-b border-l text-gray-500 border-gray-300">
                                                    {editingId === index ? (
                                                        <input
                                                            type="text"
                                                            onChange={(e) => setUsers((prev) => {
                                                                const users = [...prev]; users[index].lastName = e.target.value;
                                                                return users
                                                            })}
                                                            defaultValue={user?.lastName}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        user?.lastName
                                                    )}
                                                </td>
                                                <td className="p-2 border-b border-l border-gray-300 text-gray-500">
                                                    {editingId === index ? (
                                                        <input
                                                            type="email"
                                                            onChange={(e) => setUsers((prev) => {
                                                                const users = [...prev]; users[index].email = e.target.value;
                                                                return users
                                                            })}
                                                            defaultValue={user?.email.toLowerCase()}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        user?.email.toLowerCase()
                                                    )}
                                                </td>
                                                <td className="p-2 border-b border-l border-gray-300 text-gray-500">
                                                    {editingId === index ? (
                                                        <select
                                                            defaultValue={returnRoleName(user?.roleId)}
                                                            onChange={(e) => setUsers((prev) => {
                                                                const users = [...prev]; users[index].roleId = e.target.value; 
                                                                
                                                                return users
                                                            })}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        >
                                                            {userRoles?.map((roleEntity, idx) => (
                                                                <option key={idx} value={roleEntity?.id}>
                                                                    {roleEntity?.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        returnRoleName(user?.roleId)
                                                    )}
                                                </td>
                                                <td className="p-2 border-b border-l border-gray-300 text-gray-500">
                                                    <div className="flex justify-center">
                                                        {editingId === index ? (
                                                            <>
                                                                <i className="fa-solid fa-check mr-[20px] text-green-500 hover:text-green-600 cursor-pointer"
                                                                    onClick={() => updateUser(index)}></i>
                                                                <i className="fa-solid fa-xmark text-red-500 hover:text-red-600 cursor-pointer"
                                                                    onClick={() => setEditingId(null)}></i>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa-solid fa-pen-to-square mr-[20px] text-gray-300 hover:text-[var(--accent)] cursor-pointer"
                                                                    onClick={() => toggleEdit(index)}></i>
                                                                <i onClick={() => removeUser(index)}
                                                                    className="fa-solid fa-trash text-gray-300 hover:text-red-400 cursor-pointer"></i>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading Users...</p>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                )}


                {activeMenu === "Privilege Matrix" && (privilegeMatrix && Array.isArray(privilegeMatrix) && privilegeMatrix.length >= 0 ? (

                    <div className="w-4/5">
                        <div className="flex w-full justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                                    Privilege Matrix
                                </h2>
                            </div>
                            <div>
                                <button onClick={() => setIsNewResourceDrawer(true)} className="bg-[var(--accent)] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Create New Resource
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* User Roles */}
                            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-bold mb-2 bg-blue-100 p-2">User Roles</h3>
                                <ul>
                                    {userRoles.map((role, index) => (
                                        <li
                                            key={index}
                                            className={`p-2 border-b border-gray-300 last:border-b-0  cursor-pointer ${selectedRole?.name === role?.name
                                                ? "bg-[var(--accent)] text-white font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            onClick={() => setSelectedRole(role)}

                                        >
                                            {role?.name}
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
                                        {resourceList.map((module, moduleIndex) => (
                                            <tr key={moduleIndex}>
                                                <td className="p-2 border-b text-gray-500 border-gray-300 ">{module?.name}</td>
                                                {["view", "create", "edit", "delete"].map(
                                                    (permission, permIndex) => (
                                                        <td className="p-2 border-b border-gray-300 border-l border-gray-300 text-center" key={permIndex}>
                                                            <input
                                                                type="checkbox"
                                                                className="bg-[var(--accent)] cursor-pointer"
                                                                checked={
                                                                    checkPermission(selectedRole?.id, module?.id, permission)

                                                                }
                                                                onChange={() =>
                                                                    updatePermissoins(selectedRole?.id, module?.id, permission)
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

                            <div>
                                <button onClick={() => setIsDrawerOpen(true)} className=" cursor-pointer bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Create New User Role
                                </button>
                            </div>
                            <div>
                                {/* <button className="bg-[var(--accent)] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Save Changes
                                </button> */}
                            </div>

                        </div>
                    </div>
                ) : (

                    <div className="w-full h-full flex justify-center items-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading privileges...</p>
                        </div>
                    </div>
                )
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
                                onChange={(e) => setNewRole(e.target.value)}
                                value={newRole}
                                placeholder="Enter Role Name"
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
                                onClick={addNewRole}
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
                        <h3 className="text-xl font-bold">Create New User</h3>
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
                                    htmlFor="FirstName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="FirstName"
                                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    value={newUser?.firstName}
                                    placeholder="Enter First Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userRole"
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    value={newUser?.lastName}
                                    placeholder="Enter Last Name"
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
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    value={newUser?.email}
                                    placeholder="Enter User Email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userPsw"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="userPsw"
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    value={newUser?.password}
                                    placeholder="Enter a password"
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
                                    onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                                    value={newUser?.roleId}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled selected>
                                        Select a Role
                                    </option>
                                    {userRoles.map((role, index) => (
                                        <option key={index} value={role?.id}>
                                            {role?.name}
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
                                onClick={createANewuser}
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
                        <div>
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
                                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                                    value={newResource?.name}
                                    placeholder="Enter Resource Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Resource"
                                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                    value={newResource?.description}
                                    placeholder="Enter Resource Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="userRole"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Resource"
                                    onChange={(e) => setNewResource({ ...newResource, code: e.target.value })}
                                    value={newResource?.code}
                                    placeholder="Enter Resource Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
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
                                onClick={addNewResource}
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