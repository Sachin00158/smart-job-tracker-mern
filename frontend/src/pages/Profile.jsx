import { useEffect, useState } from "react";
import api from "../services/api";
import { FaUserCircle } from "react-icons/fa";
import ProfileView from "./ProfileView";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    role: "",
    bio: ""
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data) {
        setProfile(res.data);
        setForm(res.data);
      }
    } catch {
      console.log("No profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.post("/profile", form);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (profile) {
    return <ProfileView profile={profile} setProfile={setProfile} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <FaUserCircle size={45} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <p className="text-gray-500 text-sm">Manage your details</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid gap-4">

          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Name"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          <input name="email" value={form.email} onChange={handleChange}
            placeholder="Email"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          <input name="skills" value={form.skills} onChange={handleChange}
            placeholder="Skills"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          <input name="experience" value={form.experience} onChange={handleChange}
            placeholder="Experience"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          <input name="role" value={form.role} onChange={handleChange}
            placeholder="Preferred Role"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          <textarea name="bio" value={form.bio} onChange={handleChange}
            rows="3"
            placeholder="Bio"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none" />

          {/* BUTTONS */}
          <div className="flex justify-between mt-4">

            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              ← Back
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Profile
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}