import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  // BIO
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  // PROFILE PIC
  const [selectedPic, setSelectedPic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [updatingPic, setUpdatingPic] = useState(false);

  const navigate = useNavigate();

  /* ===================== FETCH DASHBOARD ===================== */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/users/dashboard");
        setUser(res.data.user);
        setRecipes(res.data.recipes || []);
        setBio(res.data.user.bio || "");
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, []);

  /* ===================== UPDATE BIO ===================== */
  const updateBio = async (e) => {
    e.preventDefault();
    setSavingBio(true);
    try {
      const res = await api.put("/users/update-profile", { bio });
      setUser(res.data);
      setEditingBio(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingBio(false);
    }
  };

  /* ===================== PROFILE PIC ===================== */
  const handlePicSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedPic(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const submitProfilePic = async () => {
    if (!selectedPic) return;

    setUpdatingPic(true);
    const formData = new FormData();
    formData.append("profilePic", selectedPic);

    try {
      const res = await api.put("/users/update-profile", formData);
      setUser(res.data);
      setSelectedPic(null);
      setPreviewPic(null);
    } catch (err) {
      console.error("PROFILE PIC ERROR:", err);
    } finally {
      setUpdatingPic(false);
    }
  };

  const cancelProfilePic = () => {
    setSelectedPic(null);
    setPreviewPic(null);
  };

  if (!user) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-t-2xl text-white">
          <div className="flex gap-6 items-start">

            {/* PROFILE PIC */}
            <div>
              <label className="relative cursor-pointer block w-fit">
                <img
                  src={
                    previewPic ||
                    user.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover"
                />

                {!selectedPic && (
                  <>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePicSelect}
                    />
                    <span className="absolute bottom-1 right-1 bg-white text-orange-500 text-xs px-2 py-1 rounded">
                      Edit
                    </span>
                  </>
                )}
              </label>

              {selectedPic && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={submitProfilePic}
                    disabled={updatingPic}
                    className="bg-white text-orange-500 px-4 py-1 rounded-full text-sm"
                  >
                    {updatingPic ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    onClick={cancelProfilePic}
                    className="text-white underline text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* USER INFO */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-orange-100">{user.email}</p>

              {!editingBio ? (
                <div className="mt-2 flex gap-2">
                  <p>{user.bio || "No bio yet"}</p>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-xs underline"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <form onSubmit={updateBio} className="mt-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    className="w-full p-2 rounded text-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-white text-orange-500 px-4 py-1 rounded">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBio(false)}
                      className="underline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= RECIPES ================= */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-orange-600 mb-4">
            My Recipes
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-orange-100 p-4 rounded-xl shadow flex flex-col"
              >
                {/* IMAGE */}
                {recipe.mediaType === "image" && (
                  <img
                    src={recipe.mediaUrl}
                    alt={recipe.title}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                  />
                )}

                {/* VIDEO */}
                {recipe.mediaType === "video" && (
                  <video
                    src={recipe.mediaUrl}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                    muted
                  />
                )}

                <h4 className="font-semibold text-lg">{recipe.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {recipe.description}
                </p>

                <button
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                  className="mt-auto bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
