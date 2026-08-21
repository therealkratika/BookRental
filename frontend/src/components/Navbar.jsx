import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, Heart, LogIn, Library, Menu, X } from "lucide-react";

export default function Navbar({ cartCount = 0 }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF7F2] border-b border-[#E8DFD1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-sm group-hover:bg-[#2A1B13] transition-colors">
              <Library size={22} />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-xl font-serif font-bold tracking-tight text-[#2C221E]">
                Book<span className="text-[#8C5D30]">Loop</span>
              </span>
              <p className="text-[10px] text-[#8C7A6B] font-medium uppercase tracking-widest leading-none mt-1">
                Read More, Spend Less
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg px-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search 
                  className="text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors" 
                  size={18} 
                />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                className="block w-full bg-white border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#8C7A6B] border border-[#E0D5C5] rounded bg-[#FAF7F2]">
                   Enter
                 </kbd>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-5">
            <Link 
              to="/books" 
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#63534B] hover:text-[#2C221E] px-2 py-1 transition-colors"
            >
              <BookOpen size={18} />
              <span>Browse</span>
            </Link>

            <div className="flex items-center border-l border-[#E8DFD1] ml-2 pl-4 gap-2">
              <Link to="/dashboard" className="p-2 text-[#63534B] hover:bg-[#F3ECE0] rounded-lg transition-colors relative">
                <Heart size={20} />
              </Link>
            </div>

            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-[#3D281D] text-[#FAF7F2] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2A1B13] transition-colors shadow-sm"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#63534B] hover:bg-[#F3ECE0] rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-[#E8DFD1]">
             <div className="mt-4 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" size={18} />
                   <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white border border-[#E0D5C5] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <div className="flex flex-col gap-2">
                  <Link to="/books" className="flex items-center gap-3 p-3 text-[#2C221E] font-medium hover:bg-[#F3ECE0] rounded-lg transition-colors">
                    <BookOpen size={18} /> Browse
                  </Link>
                  <Link to="/login" className="flex items-center justify-center gap-2 p-3 bg-[#3D281D] text-[#FAF7F2] rounded-lg font-medium">
                    <LogIn size={18} /> Login
                  </Link>
                </div>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}