import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  User, 
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function BookDetailModal({ book, onClose, onActionSuccess }) {
  const [rating, setRating] = useState(book?.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const handleRating = async (value) => {
    try {
      setLoading(true);
      setRating(value);
      const res = await BookSDK.rateBook(book._id, value);

      if (res?.rating !== undefined) {
        book.rating = res.rating;
      }
      book.userRating = value;

      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const phone = book.contact?.phone || book.sellerPhone || "";
  const whatsappLink = `https://wa.me/91${phone}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2C221E]/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E0D5C5] shadow-lg overflow-hidden flex flex-col md:flex-row transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          className="absolute top-4 right-4 z-50 p-2 bg-[#FAF7F2] border border-[#E0D5C5] rounded-xl text-[#63534B] hover:text-[#2C221E] hover:bg-[#EFE8DC] transition-colors shadow-xs"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* LEFT: IMAGE SECTION */}
        <div className="md:w-2/5 bg-[#FAF7F2] relative group min-h-[280px] md:min-h-[480px]">
          <img
            src={book.image || "https://images.unsplash.com/photo-1543004407-1bc9adacc49f?w=600"}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/20 to-transparent" />
        </div>

        {/* RIGHT: DETAILS SECTION */}
        <div className="md:w-3/5 p-6 md:p-10 overflow-y-auto max-h-[85vh] space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {book.category && (
                <span className="px-2.5 py-0.5 bg-[#FAF7F2] text-[#704A33] border border-[#E0D5C5] text-[10px] font-semibold uppercase tracking-wider rounded-md">
                  {book.category}
                </span>
              )}
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#E8EAE3] text-[#3D4F41] border border-[#C5CDC6] text-[10px] font-semibold uppercase tracking-wider rounded-md">
                <ShieldCheck size={12} /> {book.condition || "Good Condition"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C221E] leading-tight">
              {book.title}
            </h2>
            <p className="text-sm font-medium text-[#63534B]">
              by <span className="text-[#2C221E] font-serif font-bold underline decoration-[#8C5D30]/40 underline-offset-4">{book.author}</span>
            </p>
          </div>

          {/* Pricing Section */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-[#FAF7F2] rounded-xl border border-[#E0D5C5]">
            {(book.isForSale || book.salePrice) && (
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-[#704A33] uppercase tracking-wider">Sale Price</span>
                <span className="text-2xl font-serif font-bold text-[#3D281D]">₹{book.salePrice}</span>
              </div>
            )}
            {(book.isForSale || book.salePrice) && (book.isForRent || book.rentPricePerDay) && (
              <div className="w-px h-8 bg-[#E0D5C5] hidden sm:block" />
            )}
            {(book.isForRent || book.rentPricePerDay) && (
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-[#704A33] uppercase tracking-wider">Rent / Day</span>
                <span className="text-2xl font-serif font-bold text-[#8C5D30]">₹{book.rentPricePerDay}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-[#63534B] text-xs font-medium">
            <MapPin size={16} className="text-[#8C5D30]" />
            <span>{book.location?.city || book.city || "Unknown Location"}{book.location?.area || book.area ? `, ${book.location?.area || book.area}` : ""}</span>
          </div>

          {/* Seller Info Card */}
          <div className="p-5 border border-[#E0D5C5] rounded-xl bg-white space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl border border-[#E0D5C5] flex items-center justify-center text-[#8C5D30]">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2C221E] leading-none">{book.contact?.name || book.sellerName || book.name || "Verified Seller"}</h4>
                <p className="text-xs font-medium text-[#63534B] mt-1">Community Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a 
                href={`tel:${phone}`} 
                className="flex items-center justify-center gap-2 py-2.5 bg-[#3D281D] text-[#FAF7F2] rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#2A1B13] transition-colors shadow-xs"
              >
                <Phone size={14} /> Call
              </a>
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 py-2.5 bg-[#3D4F41] text-[#FAF7F2] rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-[#2D3B31] transition-colors shadow-xs"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Interactive Rating Section */}
          <div className="pt-4 border-t border-[#E8DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#704A33] uppercase tracking-wider flex items-center gap-2">
                 Your Rating {loading && <Loader2 size={14} className="animate-spin text-[#8C5D30]" />}
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(star)}
                    className="transition-transform duration-150 hover:scale-110 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Star
                      size={22}
                      fill={star <= (hoverRating || rating) ? "#8C5D30" : "none"}
                      className={star <= (hoverRating || rating) ? "text-[#8C5D30]" : "text-[#E0D5C5]"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E0D5C5] px-4 py-2.5 rounded-xl text-center">
              <p className="text-[10px] font-semibold text-[#704A33] uppercase tracking-wider">Avg Rating</p>
              <div className="flex items-center gap-1 justify-center mt-0.5">
                <Star size={14} fill="#8C5D30" className="text-[#8C5D30]" />
                <span className="text-lg font-serif font-bold text-[#2C221E]">
                  {book.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}