import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import JobChart from "../components/JobChart";
import JobPieChart from "../components/JobPieChart";
import { useNavigate } from "react-router-dom";

export default function Analytics() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    rejected: 0
  });

  const [Jobs, setJobs] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const statsRes = await api.get("/jobs/stats");
        const jobsRes = await api.get("/jobs");

        setStats(statsRes.data);
        setJobs(jobsRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

  }, []);

  const total = stats.applied + stats.interview + stats.rejected;

  const interviewRate =
    total === 0 ? 0 : ((stats.interview / total) * 100).toFixed(1);

  const rejectionRate =
    total === 0 ? 0 : ((stats.rejected / total) * 100).toFixed(1);

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">

        <div className="max-w-7xl mx-auto">

          <button
  onClick={() => navigate("/")}
  className="text-blue-600 mb-4 hover:underline"
>
  ← Back to Dashboard
</button>

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 rounded-xl shadow-md mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              📊 Job Analytics
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Track your job application performance
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Total */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Total Applications</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {total}
              </h2>
            </div>

            {/* Interview */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Interview Rate</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {interviewRate}%
              </h2>
            </div>

            {/* Rejection */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Rejection Rate</p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {rejectionRate}%
              </h2>
            </div>

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                📈 Job Analytics
              </h2>
              <JobChart stats={stats} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                🧩 Job Distribution
              </h2>
              <JobPieChart stats={stats} />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}