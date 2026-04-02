import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileView() {

  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const res = await api.get("/profile");
        if (isMounted) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Delete profile?")) return;

    try {
      await api.delete("/profile");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="text-white p-6">No Profile Found</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">

      <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-xl">

        <div className="flex items-center gap-4 mb-6">
          <FaUserCircle size={50} className="text-indigo-400" />
          <h2 className="text-2xl font-bold">{profile.name}</h2>
        </div>

        <div className="space-y-3 text-gray-300">

          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>

        </div>

        <div className="flex gap-4 mt-6">

          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}