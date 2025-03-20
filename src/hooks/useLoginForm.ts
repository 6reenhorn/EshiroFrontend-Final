import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginFormState } from "../types/auth";
import useMutationAuth from "./tanstack/auth/useMutationAuth";

export const useLoginForm = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: "",
    password: "",
    error: null
  });
  
  const navigate = useNavigate();
  const { useMutationLogin } = useMutationAuth();
  const { mutate } = useMutationLogin();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: null }));
    
    const { username, password } = formState;
    
    if (!username || !password) {
      setFormState(prev => ({ ...prev, error: "Please enter both username and password" }));
      return;
    }

    mutate({ username, password });
  };
  
  return {
    formState,
    handleInputChange,
    handleSubmit
  };
};