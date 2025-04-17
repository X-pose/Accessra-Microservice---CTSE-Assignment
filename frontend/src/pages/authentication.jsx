import React, { useState } from "react";
import logo from "/Logo.png";
import axiosInstance from "../api/axiosInstance";

const Authentication = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Function to clear form states
  const clearStates = () => {
    setEmail("");
    setPassword("");
    setRePassword("");
    setShowPassword(false);
  };

  const handleSignIn = async()=> {
    const payload = {
      email: email, 
      password: password,
    }

    const response = await axiosInstance.post("/accessra_microservice/auth/sign-in", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(response.status === 201) {
      const token = response?.data?.token;
      localStorage.setItem("jsonwebtoken", token);
      window.location.href = "/dashboard";
    }
    
  }

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/3 bg-gray-100 flex flex-col justify-center items-center">
        <div className="w-[60%]">
          <img src={logo} alt="logo" className="object-cover" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="text-center flex flex-col items-center justify-center mb-6">
            <div className="p-[8px] border-2 border-black w-fit rounded-sm">
              <i className="fa-regular fa-user text-4xl"></i>
            </div>
            <h2 className="text-2xl text-[var(--ebony)] font-bold my-[10px]">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p className="text-sm text-[var(--cerulean)]">
              {isLogin
                ? "Login to your super admin account to access AuthGuard"
                : "Create an account to access AuthGuard"}
            </p>
          </div>

          {/* Google Login */}
          {isLogin && (
            <button className="w-full cursor-pointer text-[var(--cerulean)] flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 mb-4 shadow-sm hover:shadow-md">
              <img
                src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>
          )}

          {isLogin && (
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gray-300 w-full"></div>
              <span className="px-2 text-sm text-gray-500">Or</span>
              <div className="h-px bg-gray-300 w-full"></div>
            </div>
          )}

          {/* Email and Password */}
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="rePassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="rePassword"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                
              </div>
            )}

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (isLogin) {
                  handleSignIn();
                } else {
                  // Handle sign-up logic here
                }
              }}
              className="w-full bg-[var(--accent)] cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="flex flex-col justify-between items-center mt-4 text-sm">
            {isLogin ? (
              <div className="flex">
                <p className="mr-[10px] text-[var(--cerulean)]">Don't have an account? </p>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    clearStates();
                  }}
                  className="text-[var(--accent)] cursor-pointer font-medium hover:underline"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex">
                <p className="mr-[10px]">Already have an account? </p>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    clearStates();
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;