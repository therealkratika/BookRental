import { useEffect, useState, useCallback } from "react";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/bookDetailsModal.jsx";
import { Search, MapPin, Loader2, FilterX } from "lucide-react";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");

  const fetchBooks = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await BookSDK.getAll();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleNearby = async () => {
    try {
      setNearbyLoading(true);
      const loc = await AppSDK.getCurrentLocation();
      if (!loc?.lat || !loc?.lng) throw new Error("Invalid location");

      const data = await BookSDK.getNearby(loc.lat, loc.lng);
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert("Please enable location services to find books nearby.");
    } finally {
      setNearbyLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    (book.title + book.author).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#FAF7F2] text-[#8C7A6B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#704A33] mb-3" />
        <p className="text-sm font-medium animate-pulse text-[#63534B]">Curating your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] selection:bg-[#E8DFD1] pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* --- HEADER & FILTERS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8DFD1]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#2C221E] tracking-tight">Browse Books</h2>
            <p className="text-sm text-[#63534B] font-sans mt-1">Discover your next favorite read from our community.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Search Bar */}
            <div className="relative group min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors" />
              <input
                type="text"
                placeholder="Title, author, or genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0D5C5] rounded-xl focus:border-[#704A33] focus:bg-white outline-none transition-all text-sm text-[#2C221E] placeholder:text-[#A09083] shadow-xs"
              />
            </div>

            {/* Nearby Button */}
            <button
              onClick={handleNearby}
              disabled={nearbyLoading}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-xs ${
                nearbyLoading 
                  ? "bg-[#EFE8DC] text-[#A09083] cursor-not-allowed" 
                  : "bg-[#3D281D] text-[#FAF7F2] hover:bg-[#2A1B13]"
              }`}
            >
              {nearbyLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              <span>{nearbyLoading ? "Locating..." : "Near Me"}</span>
            </button>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E0D5C5] text-center p-6">
            <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E8DFD1] rounded-xl flex items-center justify-center text-[#8C7A6B] mb-4">
              <FilterX size={24} />
            </div>
            <p className="text-lg font-serif font-bold text-[#2C221E]">No books found</p>
            <p className="text-sm text-[#63534B] mt-1">Try adjusting your search or filters.</p>
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#8C5D30] hover:text-[#2C221E] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="transition-transform duration-200 hover:-translate-y-1">
                <BookCard
                  book={book}
                  onSelect={setSelectedBook}
                  onRefresh={() => fetchBooks(true)}
                />
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL --- */}
        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onActionSuccess={() => fetchBooks(true)}
          />
        )}
      </div>
    </div>
  );
}