import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import { Toaster } from "react-hot-toast";
import JobBoard from "./pages/JobBoard";
import ResumeMatch from "./pages/ResumeMatch";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";





function App() {

  return (

    <BrowserRouter>
    <Toaster position="top-right" />

      <Routes>

        {/* Protected Pages */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Public Pages */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/board" element={<JobBoard />} />

        <Route path="/ai" element={<ResumeMatch />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/view" element={<ProfileView />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;