import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthSDK } from "../Api/sdk";

import {
  Search,
  BookMarked,
  PlusCircle,
  UserCircle,
  LogOut,
  Library,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthSDK.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: "/dashboard/browse",
      label: "Browse Books",
      icon: <Search size={18} />,
    },
    {
      path: "/dashboard/my-books",
      label: "My Books",
      icon: <BookMarked size={18} />,
    },
    {
      path: "/dashboard/add-book",
      label: "Add Book",
      icon: <PlusCircle size={18} />,
    },
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: <UserCircle size={18} />,
    },
  ];

  return (
    <>
      {/* ================= MOBILE TOPBAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-[#FAF7F2] border-b border-[#E0D5C5] px-4 py-3.5 flex items-center justify-between shadow-xs">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-xs">
            <Library size={18} />
          </div>

          <h2 className="text-base font-serif font-bold text-[#2C221E] tracking-tight">
            BOOK<span className="text-[#8C5D30]">LOOP</span>
          </h2>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-[#EFE8DC] text-[#3D281D] active:scale-95 transition-transform"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#2C221E]/40 backdrop-blur-xs z-[150] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-[200]
          h-screen w-64 bg-[#FAF7F2]
          border-r border-[#E0D5C5]
          px-5 py-8 flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky
        `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end mb-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-[#63534B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-xs">
            <Library size={20} />
          </div>

          <h2 className="text-xl font-serif font-bold text-[#2C221E] tracking-tight">
            BOOK<span className="text-[#8C5D30]">LOOP</span>
          </h2>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                  active
                    ? "bg-[#3D281D] text-[#FAF7F2] shadow-xs"
                    : "text-[#63534B] hover:bg-[#EFE8DC] hover:text-[#2C221E]"
                }`}
              >
                <span
                  className={`${
                    active
                      ? "text-[#FAF7F2]"
                      : "text-[#8C7A6B] group-hover:text-[#2C221E] transition-colors"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="pt-4 border-t border-[#E8DFD1]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#63534B] hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={18} className="rotate-180 text-[#8C7A6B] group-hover:text-red-700" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}