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
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">

              {/* SCORE HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">
                  Match Score
                </h2>
                <span className="text-2xl font-bold text-blue-600">
                  {result.score}%
                </span>
              </div>

              {/* PROGRESS */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 transition-all duration-700"
                  style={{ width: `${result.score}%` }}
                />
              </div>

              {/* MATCHED */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Matched Skills</p>

                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* MISSING */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Missing Skills</p>

                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-green-600 text-sm">
                      🎉 No missing skills!
                    </span>
                  )}
                </div>
              </div>

              {/* AI SUGGESTIONS */}
              {result.suggestions?.length > 0 ? (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">

                  <h3 className="text-sm font-semibold text-yellow-700 mb-2">
                    💡 AI Suggestions
                  </h3>

                  <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
                    {result.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>

                </div>
              ) : (
                <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-xl text-green-700 text-sm">
                  🎉 Your resume looks strong!
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}