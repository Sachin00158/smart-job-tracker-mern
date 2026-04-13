import { FaBars } from "react-icons/fa";

export default function Navbar({ setIsOpen }) {
  return (
    <div className="md:hidden flex items-center justify-between bg-blue-600 text-white px-4 py-3 shadow">
      
      <h1 className="text-lg font-bold">Smart Job Tracker</h1>

      <FaBars
        className="text-xl cursor-pointer"
        onClick={() => setIsOpen(prev => !prev)}
      />
    </div>
  );
}