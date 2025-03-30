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
  const [isSubmitting, setIsSubmitting] = useState(false); // New state

  const navigate = useNavigate();
  const { useMutationLogin } = useMutationAuth();
  const { mutate, isError, error } = useMutationLogin();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (isError && error) {
      setFormState(prev => ({ 
        ...prev, 
        error: "Login failed. Please check your credentials."
      }));
      setIsSubmitting(false); // Re-enable the button on error
    }
  }, [isError, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value,
      error: null 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: null }));
    setIsSubmitting(true); // Disable the button
    
    const { username, password } = formState;
    
    if (!username || !password) {
      setFormState(prev => ({ ...prev, error: "Please enter both username and password" }));
      setIsSubmitting(false); // Re-enable the button
      return;
    }

    try {
      mutate(
        { email: username, password },
        {
          onError: () => {
            setFormState(prev => ({ 
              ...prev, 
              error: "Login failed. Please check your credentials."
            }));
            setIsSubmitting(false); // Re-enable the button on error
          },
          onSuccess: () => {
            setIsSubmitting(false); // Re-enable the button on success (optional)
          }
        }
      );
    } catch (err: any) {
      setFormState(prev => ({ 
        ...prev, 
        error: "Login failed. Please check your credentials." 
      }));
      setIsSubmitting(false); // Re-enable the button on error
    }
  };
  
  return {
    formState,
    isSubmitting, // Return the state
    handleInputChange,
    handleSubmit
  };
};