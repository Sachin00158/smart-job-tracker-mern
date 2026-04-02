import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function AddJobModal({ closeModal, refreshJobs, jobData }) {

  const [company, setCompany] = useState(jobData?.company || "");
  const [position, setPosition] = useState(jobData?.position || "");
  const [status, setStatus] = useState(jobData?.status || "Applied");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company || !position) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      if (jobData) {
        await api.put(`/jobs/${jobData._id}`, {
          company,
          position,
          status
        });
        toast.success("Job updated ✅");
      } else {
        await api.post("/jobs", {
          company,
          position,
          status
        });
        toast.success("Job added 🚀");
      }

      refreshJobs();
      closeModal();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4"
      onClick={closeModal}   // ✅ click outside close
    >

      <div
        className="bg-slate-800 p-6 rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            {jobData ? "Edit Job" : "Add Job"}
          </h2>

          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="p-2 rounded bg-slate-700 w-full"
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="p-2 rounded bg-slate-700 w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded bg-slate-700 w-full"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
          </select>

          <div className="flex gap-3 mt-2">

            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-slate-600 hover:bg-slate-500 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded"
            >
              {jobData ? "Update Job" : "Add Job"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}