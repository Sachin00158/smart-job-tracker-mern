import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function ResumeMatch() {

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleCheck = async () => {

    if (!resume || !job) {
      alert("Please enter both Resume and Job Description");
      return;
    }

    try {
      const res = await api.post("/ai/match", {
        resumeText: resume,
        jobText: job
      });

      setResult(res.data);

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">

        <div className="max-w-5xl mx-auto">

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
              🤖 AI Resume Match
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Check how well your resume matches a job
            </p>
          </div>

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <textarea
              placeholder="Paste Resume..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={8}
              className="p-4 rounded-xl border bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <textarea
              placeholder="Paste Job Description..."
              value={job}
              onChange={(e) => setJob(e.target.value)}
              rows={8}
              className="p-4 rounded-xl border bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            />

          </div>

          {/* BUTTON */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCheck}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl shadow hover:scale-105 transition"
            >
              Check Match
            </button>
          </div>

          {/* RESULT */}
          {result && (
            <div className="mt-8 bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Match Score: 
                <span className="text-blue-600 ml-2">
                  {result.score}%
                </span>
              </h2>

              {/* MATCHED */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Matched Skills</p>
                <p className="text-green-600 font-medium">
                  {result.matchedSkills?.join(", ") || "None"}
                </p>
              </div>

              {/* MISSING */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Missing Skills</p>
                <p className="text-red-500 font-medium">
                  {result.missingSkills?.join(", ") || "None"}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}