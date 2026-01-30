import api from "../api/axios";

export default function UserProfile({ userId }) {
  const followUser = async () => {
    await api.put(`/users/follow/${userId}`);
    alert("Followed");
  };

  return (
    <button
      onClick={followUser}
      className="bg-indigo-500 text-white px-4 py-2"
    >
      Follow
    </button>
  );
}
