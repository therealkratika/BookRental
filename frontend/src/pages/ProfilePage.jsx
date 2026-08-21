import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import { 
  User, 
  Mail, 
  Calendar, 
  BookMarked, 
  PlusCircle, 
  Library, 
  Trash2, 
  ArrowRight,
  Heart,
  Loader2
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await AppSDK.getProfile();
        const wishlistData = await BookSDK.getWishlist();

        setUser(userData || {});
        setWishlist(wishlistData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (id) => {
    try {
      await BookSDK.removeFromWishlist(id);
      setWishlist((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err?.message || "Error removing from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#8C7A6B]">
        <Loader2 className="animate-spin mb-3 text-[#8C5D30]" size={32} />
        <p className="font-sans text-xs uppercase tracking-widest font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] selection:bg-[#E8DFD1] pt-6 md:pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* HERO / PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-[#E0D5C5] shadow-xs p-6 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar Area */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#3D281D] flex items-center justify-center text-[#FAF7F2] shadow-xs shrink-0">
              <User size={48} strokeWidth={1.5} />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C221E] tracking-tight">
                {user.name || "Book Enthusiast"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {user.email && (
                  <div className="flex items-center gap-2 text-[#63534B] font-medium bg-[#FAF7F2] border border-[#E0D5C5] px-3.5 py-1.5 rounded-xl text-xs">
                    <Mail size={14} className="text-[#8C5D30]" />
                    {user.email}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#63534B] font-medium bg-[#FAF7F2] border border-[#E0D5C5] px-3.5 py-1.5 rounded-xl text-xs">
                  <Calendar size={14} className="text-[#8C5D30]" />
                  Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "Recently"}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
              <Link 
                to="/dashboard/my-books" 
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF7F2] text-[#3D281D] border border-[#E0D5C5] rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#EFE8DC] transition-colors"
              >
                <Library size={16} /> My Collection
              </Link>
              <Link 
                to="/dashboard/add-book" 
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3D281D] text-[#FAF7F2] rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#2A1B13] transition-colors shadow-xs"
              >
                <PlusCircle size={16} /> List New Book
              </Link>
            </div>
          </div>
        </div>

        {/* --- WISHLIST SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD1]">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C221E] flex items-center gap-2.5">
              <Heart className="text-[#9B2C2C] fill-[#9B2C2C]" size={22} /> 
              Saved for Later
              <span className="text-xs font-semibold bg-[#FAF7F2] text-[#704A33] border border-[#E0D5C5] px-2.5 py-0.5 rounded-md font-sans">
                {wishlist.length}
              </span>
            </h2>
            {wishlist.length > 0 && (
              <Link to="/dashboard/browse" className="text-xs font-semibold uppercase tracking-wider text-[#8C5D30] hover:underline flex items-center gap-1">
                Browse More <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {wishlist.length === 0 ? (
            <Empty text="Your wishlist is waiting for its first book!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((book) => (
                <div 
                  key={book._id} 
                  className="group bg-white rounded-2xl p-4 border border-[#E0D5C5] shadow-xs hover:border-[#8C5D30] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/5] rounded-xl overflow-hidden mb-3.5 relative bg-[#FAF7F2]">
                      <img 
                        src={book.image || "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=400"} 
                        alt={book.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-[#2C221E]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleRemove(book._id)}
                          className="p-2.5 bg-[#FDF2F2] text-[#9B2C2C] rounded-xl border border-[#F5C6C6] shadow-md hover:bg-[#F9E2E2] transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-[#2C221E] leading-snug line-clamp-1 group-hover:text-[#8C5D30] transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs font-medium text-[#63534B]">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8DFD1]">
                    <span className="text-base font-serif font-bold text-[#3D281D]">
                      ₹{book.salePrice || book.rentPricePerDay || "N/A"}
                    </span>
                    <Link 
                      to={`/dashboard/browse`} 
                      className="p-2 bg-[#FAF7F2] rounded-xl text-[#63534B] border border-[#E0D5C5] hover:bg-[#3D281D] hover:text-[#FAF7F2] hover:border-[#3D281D] transition-colors"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E0D5C5] shadow-xs text-center px-4">
      <div className="w-16 h-16 bg-[#FAF7F2] rounded-xl border border-[#E0D5C5] flex items-center justify-center text-[#8C5D30] mb-4">
        <BookMarked size={28} />
      </div>
      <p className="text-[#2C221E] font-serif font-bold text-lg">{text}</p>
      <Link 
        to="/dashboard/browse" 
        className="mt-4 text-[#8C5D30] font-semibold text-xs uppercase tracking-wider flex items-center gap-1 hover:underline"
      >
        Go find some books <ArrowRight size={14} />
      </Link>
    </div>
  );
}