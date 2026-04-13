import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AddJobModal from "../components/AddJobModal";
import JobChart from "../components/JobChart";
import JobPieChart from "../components/JobPieChart";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

import {
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch
} from "react-icons/fa";

export default function Dashboard() {

  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    rejected: 0
  });

  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Infinite Scroll


  // 🔍 Filter
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      (job.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (job.position || "").toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || job.status === filter;

    return matchSearch && matchFilter;
  });

  const currentJobs = filteredJobs;

  // 📊 Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/jobs/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 📄 Fetch Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, []);





  // ❌ Delete
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ✏ Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/jobs/${id}`, { status: newStatus });
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  // ✏ Edit
  const handleEdit = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  // 📄 Resume Upload FIX
  const handleUpload = async (file, jobId) => {
    if (!jobs.length) {
      alert("No jobs available");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);

    try {
      const res = await api.post("/ai/match", formData);
      alert(`Match Score: ${res.data.score}%`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col">

        <Navbar setIsOpen={setIsOpen} />

        <div className="p-4 md:p-8">

          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 rounded-xl flex items-center gap-4 shadow-md mb-8">
              <h1 className="text-2xl font-bold text-white">
                Dashboard Overview
              </h1>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:scale-105 transition"
                >
                  + Add Job
                </button>

                <label className="bg-white text-purple-600 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition">
                  Upload Resume
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleUpload(e.target.files[0], jobs[0]?._id)
                    }
                  />
                </label>
              </div>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg flex justify-between">
                <div>
                  <p>Applied Jobs</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.applied}</h2>
                </div>
                <FaBriefcase className="text-4xl" />
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg flex justify-between">
                <div>
                  <p>Interviews</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.interview}</h2>
                </div>
                <FaCheckCircle className="text-4xl" />
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg flex justify-between">
                <div>
                  <p>Rejected</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.rejected}</h2>
                </div>
                <FaTimesCircle className="text-4xl" />
              </div>

            </div>

            {/* SEARCH */}
            <div className="flex gap-4 mt-6">
              <div className="relative">
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg bg-white"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="All">All</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">

              {/* HEADER */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-4 text-left">Company</th>
                      <th className="p-4 text-left">Position</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* BODY SCROLL */}
              <div className="max-h-[400px] overflow-y-auto">

                <table className="min-w-full text-sm">
                  <tbody>

                    {loading ? (
                      <tr>
                        <td colSpan="4" className="p-6 text-center">Loading...</td>
                      </tr>
                    ) : currentJobs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-6 text-center">No jobs found</td>
                      </tr>
                    ) : (
                      currentJobs.map((job) => (
                        <tr key={job._id} className="border-t hover:bg-blue-50">

                          <td className="p-4">{job.company}</td>
                          <td className="p-4">{job.position}</td>

                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${job.status === "Applied" && "bg-blue-100 text-blue-600"}
                  ${job.status === "Interview" && "bg-green-100 text-green-600"}
                  ${job.status === "Rejected" && "bg-red-100 text-red-600"}
                `}>
                              {job.status}
                            </span>
                          </td>

                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => handleEdit(job)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => deleteJob(job._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                            >
                              <FaTrash />
                            </button>
                          </td>

                        </tr>
                      ))
                    )}

                  </tbody>
                </table>

              </div>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <JobChart stats={stats} />
              <JobPieChart stats={stats} />
            </div>

          </div>
        </div>
      </div>

      {showModal && (
        <AddJobModal
          closeModal={() => {
            setShowModal(false);
            setEditJob(null);
          }}
          refreshJobs={fetchJobs}
          jobData={editJob}
        />
      )}

    </div>
  );
}