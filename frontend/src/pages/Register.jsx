import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      await api.post("/auth/register",{
        name,
        email,
        password
      });

      navigate("/login");

    }catch(err){

      console.error(err);
      setError("Registration failed");

    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-400 mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="p-3 rounded bg-slate-700 text-white"
          />

          <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="p-3 rounded bg-slate-700 text-white"
          />

          <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="p-3 rounded bg-slate-700 text-white"
          />

          <button
          type="submit"
          className="bg-blue-500 py-3 rounded"
          >
          Register
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">

          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>

        </p>

      </div>

    </div>

  )

}