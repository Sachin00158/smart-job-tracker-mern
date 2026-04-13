import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import api from "../services/api";

export default function ProfileView({ profile, setProfile }) {

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Delete profile?")) return;

    try {
      await api.delete("/profile");
      setProfile(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile.name?.charAt(0)}
          </div>

          {/* NAME */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.name}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {profile.role}
            </p>
          </div>

        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-gray-50 p-4 rounded-xl hover:shadow transition">
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold text-gray-800 mt-1">
              {profile.email}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl hover:shadow transition">
            <p className="text-xs text-gray-500">Skills</p>
            <p className="font-semibold text-gray-800 mt-1">
              {profile.skills}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl hover:shadow transition">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="font-semibold text-gray-800 mt-1">
              {profile.experience}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl hover:shadow transition">
            <p className="text-xs text-gray-500">Role</p>
            <p className="font-semibold text-gray-800 mt-1">
              {profile.role}
            </p>
          </div>

        </div>

        {/* BIO */}
        <div className="mt-6 bg-gray-50 p-4 rounded-xl hover:shadow transition">
          <p className="text-xs text-gray-500">Bio</p>
          <p className="text-gray-700 mt-1">
            {profile.bio}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() => setProfile(null)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}