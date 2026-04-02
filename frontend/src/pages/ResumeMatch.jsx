import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function ResumeMatch() {

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {

    // ✅ FIXED VARIABLES
    if (!resume || !job) {
      alert("Please enter both Resume and Job Description");
      return;
    }

    try {
      const res = await api.post("/ai/match", {
        resumeText: resume,   // ✅ correct mapping
        jobText: job          // ✅ correct mapping
      });

      console.log(res.data);
      setResult(res.data);

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-white">

      <Sidebar />

      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          AI Resume Match
        </h1>

        <div className="grid gap-4">

          <textarea
            placeholder="Paste Resume..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="p-3 bg-slate-800 rounded"
            rows={6}
          />

          <textarea
            placeholder="Paste Job Description..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="p-3 bg-slate-800 rounded"
            rows={4}
          />

          <button
            onClick={handleCheck}
            className="bg-blue-500 py-2 rounded"
          >
            Check Match
          </button>

        </div>

        {result && (
          <div className="mt-6 bg-slate-800 p-4 rounded">

            <h2 className="text-xl font-bold mb-2">
              Match Score: {result.score}%
            </h2>

            <p className="text-green-400">
              Matched: {result.matchedSkills?.join(", ")}
            </p>

            <p className="text-red-400 mt-2">
              Missing: {result.missingSkills?.join(", ")}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}