import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    role: "",
    bio: ""
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* FETCH */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data) setForm(res.data);
    } catch {
      console.log("No profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* SAVE */
  const handleSave = async () => {
  try {
    await api.post("/profile", form);

    // 🔥 redirect to view page
    navigate("/profile/view");

  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">

      <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <FaUserCircle size={50} className="text-indigo-400" />
          <div>
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="text-gray-400 text-sm">Manage your details</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (React, Node...)"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience (0-1 years)"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Preferred Role"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="About You"
            rows="3"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          {/* BUTTON */}
          <button
            onClick={handleSave}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 transition py-3 rounded-lg font-semibold shadow-md"
          >
            Save Profile
          </button>

        </div>

      </div>

    </div>
  );
}