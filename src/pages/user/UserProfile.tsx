import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/services/axiosInstance";

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    complete_address: "",
    email: "",
    cellphone_number: "",
    payment_method: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Authentication token is missing. Redirecting to login page.");
        navigate("/login");
        return;
      }
    
      try {
        const response = await api.get("/profile/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (response.status === 200) {
          setUserInfo({
            full_name: response.data.full_name || "N/A",
            complete_address: response.data.complete_address || "N/A",
            email: response.data.email || "N/A",
            cellphone_number: response.data.cellphone_number || "N/A",
            payment_method: response.data.payment_method || "N/A",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error instanceof Error && (error as any).response && (error as any).response.status === 500) {
          alert("A server error occurred. Please contact support.");
        } else {
          alert("Failed to fetch user profile. Please ensure your profile is set up.");
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication token is missing. Redirecting to login page.");
      navigate("/login");
      return;
    }
  
    try {
      await api.put("/profile/", userInfo, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      alert("User information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user information:", error);
      alert("Failed to update user information. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black font-inter">
      <aside className="w-1/4 bg-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700 text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-2 font-semibold">Welcome, {userInfo.full_name}</p>
          <p className="mt-2 text-gray-300">Thank you for choosing <span className="text-blue-400 font-semibold">Éshiro!</span></p>
        </div>
        <ul className="p-4 space-y-4">
          <li onClick={() => setActiveTab("info")} className={`cursor-pointer p-3 rounded-lg text-lg font-medium text-center ${activeTab === "info" ? "bg-blue-600" : "hover:bg-gray-500"}`}>User Information ‎ ➤</li>
          <li onClick={handleLogout} className="cursor-pointer p-3 rounded-lg bg-red-600 mt-8 text-center font-semibold">Log Out</li>
        </ul>
      </aside>

      <main className="w-3/4 p-8 flex justify-center items-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl text-left">
          {activeTab === "info" && (
            <div>
              <h2 className="text-3xl font-bold text-blue-200 mb-6">USER INFORMATION</h2>
              {isEditing ? (
                <form className="space-y-6">
                  {Object.entries(userInfo).map(([key, value]) => (
                    <label key={key} className="block">
                      <span className="text-gray-400 font-medium">{key.replace("_", " ").toUpperCase()}:</span>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-4 rounded-lg bg-gray-800 text-gray-100 border border-gray-500 focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                      />
                    </label>
                  ))}

                  <div className="flex justify-start gap-4 mt-6">
                    <button type="button" onClick={handleSave} className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-500">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="py-3 px-6 bg-gray-700 text-white font-semibold rounded-lg text-lg hover:bg-gray-600">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {Object.entries(userInfo).map(([key, value]) => (
                    <p key={key} className="text-lg">
                      <strong className="text-gray-400">{key.replace("_", " ").toUpperCase()}:</strong> <span className="text-green-400">{value}</span>
                    </p>
                  ))}
                  <button onClick={() => setIsEditing(true)} className="mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-500">Edit Information</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
