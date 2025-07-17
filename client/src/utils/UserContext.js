import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../API/API";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await getProfile(userId);
        const profile = response.data;
        setUser({
          ...profile.user,
          
          location: profile.location || "",
          experience: profile.experience || [],
          education: profile.education || [],
          skills: profile.skills || [],
          profilepic: profile.user.profilepic || null,
        });
      } catch (err) {
        console.error("Error fetching user from context:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
