// hooks/useSignUpForm.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/services/axiosInstance";
import axios from "axios";
import { SignUpFormData } from "../types/auth";

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
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

  return {
    formData,
    errorMessage,
    handleChange,
    handleSignUp
  };
};