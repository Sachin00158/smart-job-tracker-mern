import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function JobBoard() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    return res.data;
  };

  useEffect(() => {
    let isMounted = true;

    const loadJobs = async () => {
      const data = await fetchJobs();
      if (isMounted) setJobs(data);
    };

    loadJobs();
    return () => { isMounted = false; };

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
      className="bg-white p-4 rounded-xl shadow min-h-[350px] flex flex-col"
    >
      <h2 className={`mb-4 font-semibold text-lg ${color}`}>
        {status}
      </h2>

      <div className="flex-1 space-y-3">

        {jobs
          .filter((job) => job.status === status)
          .map((job) => (
            <div
              key={job._id}
              draggable
              onDragStart={(e) => onDragStart(e, job._id)}
              className="bg-gray-100 p-3 rounded-lg cursor-grab hover:bg-blue-50 transition shadow-sm"
            >
              <p className="font-semibold text-gray-800">
                {job.company}
              </p>
              <p className="text-sm text-gray-500">
                {job.position}
              </p>
            </div>
          ))}

      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">

        <div className="max-w-7xl mx-auto">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 mb-4 hover:underline"
          >
            ← Back to Dashboard
          </button>

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 rounded-xl shadow-md mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              📌 Job Board
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Drag & drop to manage your applications
            </p>
          </div>

          {/* BOARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {renderColumn("Applied", "font-bold text-blue-600")}
            {renderColumn("Interview", "font-bold text-green-600")}
            {renderColumn("Rejected", "font-bold text-red-600")}

          </div>

        </div>

      </div>

    </div>
  );
}