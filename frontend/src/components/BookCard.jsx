import { useState, useEffect } from "react";
import { BookSDK } from "../Api/bookSDK";
import {
  Heart,
  Star,
  ShoppingBag,
  Clock,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function BookCard({ book, onSelect, onRefresh }) {
  const [wishlisted, setWishlisted] = useState(
    book.isWishlisted || false
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWishlisted(book.isWishlisted || false);
  }, [book.isWishlisted, book._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const previousState = wishlisted;
    setWishlisted(!previousState);

    try {
      setLoading(true);

      if (previousState) {
        await BookSDK.removeFromWishlist(book._id);
      } else {
        await BookSDK.addToWishlist(book._id);
      }

      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
      setWishlisted(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      onClick={() => onSelect && onSelect(book)}
      className="
        group relative cursor-pointer
        bg-white
        border border-[#E5DCCF]
        rounded-2xl
        overflow-hidden
        shadow-[0_4px_18px_rgba(61,40,29,0.06)]
        hover:shadow-[0_14px_35px_rgba(61,40,29,0.12)]
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      {/* =========================================
          BOOK COVER
      ========================================= */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3ECE3]">

        <img
          src={
            book.image ||
            "https://images.unsplash.com/photo-1543004407-1bc9adacc49f?w=600"
          }
          alt={book.title}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.04]
          "
        />

        {/* Soft bottom gradient */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-28
            bg-gradient-to-t
            from-[#2C221E]/45
            to-transparent
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-300
          "
        />

        {/* =========================================
            WISHLIST
        ========================================= */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={loading}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`
            absolute top-3.5 right-3.5 z-10
            w-9 h-9
            rounded-full
            flex items-center justify-center
            backdrop-blur-sm
            border
            transition-all duration-200

            ${
              wishlisted
                ? `
                  bg-[#FFF4F1]
                  border-[#F0CFC8]
                  text-[#B64A3C]
                  shadow-sm
                `
                : `
                  bg-[#FAF7F2]/95
                  border-[#E5DCCF]
                  text-[#8C7A6B]
                  hover:text-[#B64A3C]
                  hover:bg-white
                `
            }
          `}
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            fill={wishlisted ? "currentColor" : "none"}
            className={loading ? "animate-pulse" : ""}
          />
        </button>

        {/* =========================================
            RENT / CONDITION BADGES
        ========================================= */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">

          {book.isForRent && (
            <span
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1.5
                rounded-md
                bg-[#3D281D]/90
                backdrop-blur-sm
                text-[#FAF7F2]
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
              "
            >
              <Clock size={10} strokeWidth={2} />
              Rent
            </span>
          )}

          {book.condition && (
            <span
              className="
                px-2.5 py-1.5
                rounded-md
                bg-[#FAF7F2]/95
                backdrop-blur-sm
                border border-[#E5DCCF]
                text-[#5C493D]
                text-[9px]
                font-bold
                uppercase
                tracking-[0.1em]
              "
            >
              {book.condition}
            </span>
          )}
        </div>

        {/* =========================================
            HOVER ACTION
        ========================================= */}
        <div
          className="
            absolute bottom-4 left-4 right-4
            translate-y-3 opacity-0
            group-hover:translate-y-0
            group-hover:opacity-100
            transition-all duration-300
          "
        >
          <div
            className="
              w-full
              bg-[#FAF7F2]
              text-[#3D281D]
              rounded-lg
              py-2.5
              px-4
              flex items-center justify-center gap-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              shadow-lg
            "
          >
            View Book
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>

      {/* =========================================
          CARD CONTENT
      ========================================= */}
      <div className="p-4.5 sm:p-5">

        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-3">

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#8C5D30]
            "
          >
            {book.category || "General"}
          </span>

          {book.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star
                size={12}
                fill="currentColor"
                className="text-[#C48A3A]"
              />

              <span className="text-[11px] font-semibold text-[#63534B]">
                {book.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* =========================================
            TITLE
        ========================================= */}
        <div className="min-h-[62px]">

          <h3
            className="
              font-serif
              text-[19px]
              font-bold
              leading-[1.15]
              text-[#2C221E]
              line-clamp-2
              group-hover:text-[#704A33]
              transition-colors duration-200
            "
          >
            {book.title}
          </h3>

          <p
            className="
              mt-1.5
              text-xs
              font-medium
              text-[#8C7A6B]
              truncate
            "
          >
            by {book.author}
          </p>
        </div>

        {/* =========================================
            LOCATION
        ========================================= */}
        {(book.city || book.area) && (
          <div className="flex items-center gap-1.5 mt-3">

            <MapPin
              size={12}
              className="text-[#8C5D30] shrink-0"
            />

            <span
              className="
                text-[10px]
                font-medium
                text-[#8C7A6B]
                truncate
              "
            >
              {[book.area, book.city]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* =========================================
            DIVIDER
        ========================================= */}
        <div className="border-t border-[#EEE7DD] mt-4 pt-3.5">

          <div className="flex items-end justify-between">

            {/* PRICE */}
            <div>

              {book.isForSale && (
                <>
                  <span
                    className="
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      font-bold
                      text-[#9B8B7D]
                      mb-0.5
                    "
                  >
                    Price
                  </span>

                  <span
                    className="
                      text-lg
                      font-bold
                      text-[#2C221E]
                    "
                  >
                    ₹{book.salePrice}
                  </span>
                </>
              )}

              {book.isForRent && (
                <>
                  <span
                    className="
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      font-bold
                      text-[#9B8B7D]
                      mb-0.5
                    "
                  >
                    Rent
                  </span>

                  <div className="flex items-baseline gap-1">

                    <span
                      className="
                        text-lg
                        font-bold
                        text-[#2C221E]
                      "
                    >
                      ₹{book.rentPricePerDay}
                    </span>

                    <span className="text-[10px] text-[#9B8B7D]">
                      / day
                    </span>

                  </div>
                </>
              )}
            </div>

            {/* BOOK ACTION */}
            <div
              className="
                w-9 h-9
                rounded-lg
                border border-[#E5DCCF]
                bg-[#FAF7F2]
                text-[#704A33]
                flex items-center justify-center
                group-hover:bg-[#3D281D]
                group-hover:text-[#FAF7F2]
                group-hover:border-[#3D281D]
                transition-all duration-200
              "
            >
              <ShoppingBag
                size={16}
                strokeWidth={1.8}
              />
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}