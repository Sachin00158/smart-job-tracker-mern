import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function JobBoard() {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    return res.data;
  };

  useEffect(() => {
    let isMounted = true;

    const loadJobs = async () => {
      const data = await fetchJobs();
      if (isMounted) {
        setJobs(data);
      }
    };

    loadJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/jobs/${id}`, { status });
    const data = await fetchJobs();
    setJobs(data);
  };

  const onDrop = (e, status) => {
    const id = e.dataTransfer.getData("id");
    updateStatus(id, status);
  };

  const allowDrop = (e) => e.preventDefault();

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const renderColumn = (status, color) => (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={allowDrop}
      className="bg-slate-800 p-4 rounded-xl min-h-[300px]"
    >
      <h2 className={`mb-4 font-bold ${color}`}>
        {status}
      </h2>

      {jobs
        .filter((job) => job.status === status)
        .map((job) => (
          <div
            key={job._id}
            draggable
            onDragStart={(e) => onDragStart(e, job._id)}
            className="bg-slate-700 p-3 mb-3 rounded cursor-grab hover:bg-slate-600"
          >
            <p className="font-semibold">{job.company}</p>
            <p className="text-sm text-gray-300">{job.position}</p>
          </div>
        ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-white">

      <Sidebar />

      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Job Board
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {renderColumn("Applied", "text-blue-400")}
          {renderColumn("Interview", "text-green-400")}
          {renderColumn("Rejected", "text-red-400")}

        </div>

      </div>

    </div>
  );
}