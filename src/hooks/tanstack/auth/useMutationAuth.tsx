import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api/services/apiService";
import { useNavigate } from "react-router-dom";

const useMutationAuth = () => {
  const navigate = useNavigate();

  const useMutationLogin = () => {
    return useMutation({
      mutationFn: ({ username, password }: { username: string; password: string }) => login(username, password),
      onSuccess: (response: any) => {
        console.log("API Response:", response);
      
        if (!response || !response.token || !response.user_id) {
          console.error("Invalid API response", response);
          return;
        }
      
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user_id", response.user_id.toString());
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      },
      onError: (errors: any) => {
        console.error(errors);
      },
    });
  };

  return {
    useMutationLogin,
  };
};

export default useMutationAuth;