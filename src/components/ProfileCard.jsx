import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/profile").then(res => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white shadow rounded p-4 flex items-center gap-4">
      <img
        src={user.avatar || "https://via.placeholder.com/80"}
        className="w-20 h-20 rounded-full"
      />
      <div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-sm mt-1">
          Followers: {user.followers?.length || 0} | Following: {user.following?.length || 0}
        </p>
      </div>
    </div>
  );
}
