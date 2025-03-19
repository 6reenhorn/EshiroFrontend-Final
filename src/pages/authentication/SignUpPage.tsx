import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/services/axiosInstance";
import axios from "axios";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", formData); // Log the form data
    try {
      const response = await api.post("/register/", formData);
      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to the login page after successful sign-up
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error during registration:", error.response);
        setErrorMessage(
          error.response?.data?.detail || "User with this email already exists."
        );
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-700 p-4">
      {/* Logo Section (Hidden on Small Screens) */}
      <div className="hidden md:flex items-center justify-center md:w-1/2 lg:w-2/5 min-h-[300px]">
        <div className="w-[250px] h-[250px] flex items-center justify-center"
        onClick={() => navigate("/")} 
        style={{ 
          cursor: "pointer" }}
          onMouseEnter={(e) => {
            (e.target as HTMLDivElement).style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLDivElement).style.transform = "scale(1)";
          }}
       >      
          {/* Logo hehe*/}
          <div className="logo-wrapper">
            <div className="logo-face front">
              <img src="https://i.imghippo.com/files/chP3718kF.png" alt="" className="logo-image" />
            </div>
            <div className="logo-face right">
              <img src="https://i.imghippo.com/files/chP3718kF.png" alt="" className="logo-image" />
            </div>
            <div className="logo-face back">
              <img src="https://i.imghippo.com/files/chP3718kF.png" alt="" className="logo-image" />
            </div>
            <div className="logo-face left">
              <img src="https://i.imghippo.com/files/chP3718kF.png" alt="" className="logo-image" />
            </div>
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div
        className="p-8 rounded-2xl shadow-2xl w-full max-w-sm md:w-1/2 lg:w-2/5"
        style={{
          background: "linear-gradient(to bottom, #121212, #383838)",
          border: "1px solid #444",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
          Sign Up
        </h2>
        <form className="w-full" onSubmit={handleSignUp}>
          {["email", "username", "password"].map((field, index) => (
            <div key={index} className="mb-4">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-white capitalize"
              >
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border border-gray-300 text-black rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-purple-700 to-blue-500 transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-4">
          By signing up, you agree to our{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
        <div className="mt-4 text-center">
          <span className="text-sm text-white">Have an account?</span>{" "} 
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;