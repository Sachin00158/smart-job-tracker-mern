import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import JobChart from "../components/JobChart";
import JobPieChart from "../components/JobPieChart";

export default function Analytics() {

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

    <div className="flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 p-6 md:p-8">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Job Analytics
        </h1>

        {/* Analytics Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Total Applications */}

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-gray-400">Total Applications</p>
            <h2 className="text-3xl font-bold text-blue-400">
              {stats.applied + stats.interview + stats.rejected}
            </h2>
          </div>

          {/* Interview Rate */}

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-gray-400">Interview Rate</p>
            <h2 className="text-3xl font-bold text-green-400">
              {((stats.interview / (stats.applied + stats.interview + stats.rejected || 1)) * 100).toFixed(1)}%
            </h2>
          </div>

          {/* Rejection Rate */}

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-gray-400">Rejection Rate</p>
            <h2 className="text-3xl font-bold text-red-400">
              {((stats.rejected / (stats.applied + stats.interview + stats.rejected || 1)) * 100).toFixed(1)}%
            </h2>
          </div>

        </div>





        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <JobChart stats={stats} />

          <JobPieChart stats={stats} />

        </div>

      </div>

    </div>

  );
}