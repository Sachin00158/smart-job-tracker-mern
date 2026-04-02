import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AddJobModal from "../components/AddJobModal";
import JobChart from "../components/JobChart";
import JobPieChart from "../components/JobPieChart";
import CountUp from "react-countup";
import toast from "react-hot-toast";

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

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  /* ---------------- FILTER ---------------- */

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      (job.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (job.position || "").toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || job.status === filter;

    return matchSearch && matchFilter;
  });

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);

  /* ---------------- TOP COMPANIES ---------------- */

  const TopCompanies = Object.values(
    jobs.reduce((acc, job) => {
      const company = job.company || "Unknown";
      acc[company] = acc[company] || { company, count: 0 };
      acc[company].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count).slice(0, 5);

  /* ---------------- RECENT ACTIVITY ---------------- */

  const RecentActivity = jobs.slice(0, 5);

  /* ---------------- FETCH ---------------- */

  const fetchStats = async () => {
    try {
      const res = await api.get("/jobs/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  /* ---------------- DELETE ---------------- */

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
      fetchStats(); // ✅ fix
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ---------------- UPDATE ---------------- */

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/jobs/${id}`, { status: newStatus });
      fetchJobs();
      fetchStats(); // ✅ fix
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  /* ---------------- AI UPLOAD ---------------- */

  const handleUpload = async (file, jobId) => {
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

  /* ---------------- RESET PAGE ---------------- */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 p-6 md:p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>

          <div className="flex gap-3">

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
            >
              + Add Job
            </button>

            {/* ✅ Upload Resume SAME STYLE */}
            <label className="bg-purple-500 px-4 py-2 rounded cursor-pointer">
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

        {/* STATS (UNCHANGED) */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Applied Jobs</p>
            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              <CountUp end={stats.applied} duration={1} />
            </h2>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Interviews</p>
            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {stats.interview}
            </h2>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Rejected</p>
            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {stats.rejected}
            </h2>
          </div>

        </div>

  {/* CHARTS */}

  {/* SEARCH */}
<div className="flex flex-col sm:flex-row gap-4 mb-5 mt-5">

  <input
    type="text"
    placeholder="Search company or position..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="px-4 py-2 rounded bg-slate-700 text-white w-64"
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="px-4 py-2 rounded bg-slate-700 text-white"
  >
    <option value="All">All</option>
    <option value="Applied">Applied</option>
    <option value="Interview">Interview</option>
    <option value="Rejected">Rejected</option>
  </select>

</div>

{/* TABLE */}
<div className="mt-10">

  <h2 className="text-xl font-semibold mb-4">
    Recent Jobs
  </h2>

  <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden">

    <table className="w-full text-left">

      <thead className="bg-slate-700 text-gray-300">
        <tr>
          <th className="p-4">Company</th>
          <th className="p-4">Position</th>
          <th className="p-4">Status</th>
          <th className="p-4">Action</th>
        </tr>
      </thead>

      <tbody>

        {loading ? (
          <tr>
            <td colSpan="4" className="p-6 text-center text-gray-400">
              Loading...
            </td>
          </tr>
        ) : currentJobs.length === 0 ? (
          <tr>
            <td colSpan="4" className="p-6 text-center text-gray-400">
              No jobs found
            </td>
          </tr>
        ) : (
          currentJobs.map((job) => (
            <tr key={job._id} className="border-t border-slate-700">

              <td className="p-4">{job.company}</td>

              <td className="p-4">{job.position}</td>

              <td className="p-4">
                <select
                  value={job.status}
                  onChange={(e) =>
                    updateStatus(job._id, e.target.value)
                  }
                  className="bg-slate-700 px-3 py-1 rounded text-sm"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>

              <td className="p-4 flex gap-3">

                <button
                  onClick={() => handleEdit(job)}
                  className="text-blue-400 hover:text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))
        )}

      </tbody>

    </table>


  </div>
   {/* PAGINATION (RIGHT SIDE SMALL) */}
  <div className="flex justify-end items-center gap-2 mt-1">

    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      className="px-3 py-1 bg-slate-700 rounded"
    >
      {"<"}
    </button>

    <span className="text-sm text-gray-400">
      Page {currentPage}
    </span>

    <button
      onClick={() =>
        setCurrentPage(prev =>
          indexOfLast < filteredJobs.length ? prev + 1 : prev
        )
      }
      className="px-3 py-1 bg-slate-700 rounded"
    >
      {">"}
    </button>

  </div>


{/* TOP COMPANIES + ACTIVITY */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
    <h2 className="text-lg font-semibold mb-4">Top Companies</h2>

    <div className="flex flex-col gap-3">
      {TopCompanies.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span>{item.company}</span>
          <span className="text-blue-400">{item.count}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

    <div className="flex flex-col gap-3 text-sm">
      {RecentActivity.map((job) => (
        <div key={job._id} className="flex justify-between">
          <span>{job.company} — {job.position}</span>
          <span className="text-gray-400">{job.status}</span>
        </div>
      ))}
    </div>
  </div>

</div>

 

</div>

{/* CHARTS */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
  <JobChart stats={stats} />
  <JobPieChart stats={stats} />
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