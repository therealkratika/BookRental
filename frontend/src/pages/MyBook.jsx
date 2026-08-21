import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { BookSDK } from "../Api/bookSDK";
import {
  Trash2,
  MapPin,
  Package,
  Pencil,
  Plus,
  Loader2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyBooks = async () => {
    try {
      setError(null);
      const data = await BookSDK.getMy();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyBooks();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    try {
      setDeletingId(id);
      await BookSDK.deleteMy(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete the listing.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#8C7A6B]">
        <Loader2 className="animate-spin mb-3 text-[#8C5D30]" size={32} />
        <p className="font-sans text-xs uppercase tracking-widest font-semibold">Syncing your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] selection:bg-[#E8DFD1] pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8DFD1]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-xs shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C221E] tracking-tight">Your Inventory</h1>
              <p className="text-sm text-[#63534B] font-sans mt-0.5">
                Manage the books you've listed for the community.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white px-5 py-2.5 rounded-xl border border-[#E0D5C5] shadow-xs flex items-center gap-3">
              <span className="text-xs font-semibold text-[#704A33] uppercase tracking-wider">
                Total Listings
              </span>
              <span className="text-xl font-serif font-bold text-[#3D281D]">{books.length}</span>
            </div>
            <Link
              to="/dashboard/add-book"
              className="flex items-center gap-2 bg-[#3D281D] text-[#FAF7F2] px-5 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#2A1B13] transition-colors shadow-xs"
            >
              <Plus size={16} /> Add New
            </Link>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="flex items-center justify-between gap-4 bg-[#FDF2F2] border border-[#F5C6C6] rounded-xl px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-[#9B2C2C] text-sm font-medium">
              <AlertTriangle size={18} />
              {error}
            </div>
            <button
              onClick={fetchMyBooks}
              className="text-[#9B2C2C] font-semibold text-xs uppercase tracking-wider hover:underline shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* CONTENT */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E0D5C5] shadow-xs text-center px-4">
            <div className="w-16 h-16 bg-[#FAF7F2] rounded-xl border border-[#E0D5C5] flex items-center justify-center text-[#8C5D30] mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C221E]">Your library is empty</h3>
            <p className="text-sm text-[#63534B] max-w-xs mt-1">
              You haven't listed any books for sale or rent yet.
            </p>
            <Link
              to="/dashboard/add-book"
              className="mt-5 text-[#8C5D30] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Start listing now <TrendingUp size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const isDeleting = deletingId === book._id;
              return (
                <div
                  key={book._id}
                  className="group bg-white rounded-2xl border border-[#E0D5C5] shadow-xs hover:border-[#8C5D30] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image & Badges */}
                  <div className="relative h-56 bg-[#FAF7F2] overflow-hidden">
                    <img
                      src={
                        book.image ||
                        "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=400"
                      }
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border shadow-xs ${
                          book.isForSale
                            ? "bg-[#E8EAE3] text-[#3D4F41] border-[#C5CDC6]"
                            : "bg-[#F3ECE0] text-[#704A33] border-[#E0D5C5]"
                        }`}
                      >
                        {book.isForSale ? "For Sale" : "For Rent"}
                      </span>
                      {book.status && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-[#2C221E] border border-[#E0D5C5]">
                          {book.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-serif font-bold text-[#2C221E] leading-snug line-clamp-1 group-hover:text-[#8C5D30] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs font-medium text-[#63534B]">{book.author}</p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-[#E8DFD1] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#63534B] text-xs font-medium">
                          <MapPin size={14} className="text-[#8C5D30]" />
                          {book.location?.city || book.city || "Location not set"}
                        </div>
                        <div className="text-base font-serif font-bold text-[#3D281D]">
                          ₹{book.isForSale ? book.salePrice : `${book.rentPricePerDay}/d`}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleDelete(book._id)}
                          disabled={isDeleting}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FDF2F2] text-[#9B2C2C] font-semibold text-xs border border-[#F5C6C6] hover:bg-[#F9E2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          <span>{isDeleting ? "Removing..." : "Delete"}</span>
                        </button>
                        <Link
                          to={`/dashboard/edit-book/${book._id}`}
                          className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#63534B] border border-[#E0D5C5] hover:bg-[#3D281D] hover:text-[#FAF7F2] hover:border-[#3D281D] transition-colors flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}