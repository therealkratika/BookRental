import { useState } from "react";
import { AppSDK } from "../Api/appSdk";
import { BookSDK } from "../Api/bookSDK";
import {
  BookPlus,
  MapPin,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  UploadCloud,
  Type,
} from "lucide-react";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    type: "sell",
    city: "",
    area: "",
    coordinates: {
      lat: null,
      lng: null,
    },
    image: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationError, setLocationError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------------------------
  // GET CURRENT LOCATION + AUTO FILL CITY & AREA
  // --------------------------------------------------
  const handleUseCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      setLocationMessage("");
      setLocationError("");

      // Get GPS coordinates
      const loc = await AppSDK.getCurrentLocation();

      const lat = Number(loc.lat);
      const lng = Number(loc.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error("Invalid location coordinates");
      }

      let city = "";
      let area = "";

      try {
        // Reverse geocoding
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Unable to find address");
        }

        const data = await res.json();

        console.log("Nominatim response:", data);

        const addr = data.address || {};

        // -----------------------------
        // CITY
        // -----------------------------
        city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.city_district ||
          "";

        // -----------------------------
        // AREA
        // -----------------------------
        area =
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.hamlet ||
          addr.residential ||
          addr.road ||
          "";

        // If no area was found, use district
        if (!area) {
          area =
            addr.district ||
            addr.state_district ||
            addr.county ||
            "";
        }

        // Extra fallback:
        // Sometimes Nominatim gives only display_name.
        if (!city && data.display_name) {
          const parts = data.display_name.split(",");

          if (parts.length > 0) {
            city = parts[parts.length - 3]?.trim() || "";
          }
        }

        console.log("Detected city:", city);
        console.log("Detected area:", area);
      } catch (geoErr) {
        console.warn("Reverse geocoding failed:", geoErr);

        // GPS itself still worked, so save coordinates.
        setLocationError(
          "Location captured, but address could not be detected. Please enter city and area manually."
        );
      }

      // Update form
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          lat,
          lng,
        },
        city: city || prev.city,
        area: area || prev.area,
      }));

      // Success message
      if (city || area) {
        setLocationMessage("Location detected successfully");
      }
    } catch (err) {
      console.error("Location error:", err);

      setLocationError(
        err?.message ||
          "Unable to get your location. Please allow location permission."
      );
    } finally {
      setGettingLocation(false);
    }
  };

  // --------------------------------------------------
  // IMAGE UPLOAD
  // --------------------------------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const url = await AppSDK.uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.price ||
      !formData.sellerName ||
      !formData.sellerPhone
    ) {
      return alert("Fill all required fields");
    }

    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      return alert("Please capture your location 📍");
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        author: formData.author,

        isForSale: formData.type === "sell",
        isForRent: formData.type === "rent",

        salePrice:
          formData.type === "sell"
            ? Number(formData.price)
            : undefined,

        rentPricePerDay:
          formData.type === "rent"
            ? Number(formData.price)
            : undefined,

        image: formData.image,

        city: formData.city,
        area: formData.area,

        coordinates: formData.coordinates,

        name: formData.sellerName,
        phone: formData.sellerPhone,
        email: formData.sellerEmail,
      };

      console.log("Creating book:", payload);

      await BookSDK.create(payload);

      alert("Book added 🎉");

      // Reset form
      setFormData({
        title: "",
        author: "",
        price: "",
        type: "sell",
        city: "",
        area: "",
        coordinates: {
          lat: null,
          lng: null,
        },
        image: "",
        sellerName: "",
        sellerPhone: "",
        sellerEmail: "",
      });

      setLocationMessage("");
      setLocationError("");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Error creating book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] selection:bg-[#E8DFD1] pt-6 md:pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-[#E8DFD1]">
          <div className="w-10 h-10 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-xs shrink-0">
            <BookPlus size={20} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C221E] tracking-tight">
              List Your Book
            </h1>

            <p className="text-sm text-[#63534B] font-sans mt-0.5">
              Fill in the details to share your book with the community.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* =========================================
              BOOK DETAILS
          ========================================= */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E0D5C5] shadow-xs space-y-6">

            <h2 className="text-base font-serif font-bold text-[#2C221E] flex items-center gap-2 pb-3 border-b border-[#E8DFD1]">
              <Type className="text-[#8C5D30]" size={18} />
              Book Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* TITLE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33]">
                  Book Title *
                </label>

                <input
                  name="title"
                  placeholder="e.g. The Great Gatsby"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />
              </div>

              {/* AUTHOR */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33]">
                  Author Name *
                </label>

                <input
                  name="author"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33]">
                  Pricing & Intent *
                </label>

                <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#E0D5C5]">

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: "sell",
                      })
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      formData.type === "sell"
                        ? "bg-[#3D281D] text-[#FAF7F2] shadow-xs"
                        : "text-[#63534B] hover:text-[#2C221E]"
                    }`}
                  >
                    Sell
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: "rent",
                      })
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      formData.type === "rent"
                        ? "bg-[#3D281D] text-[#FAF7F2] shadow-xs"
                        : "text-[#63534B] hover:text-[#2C221E]"
                    }`}
                  >
                    Rent
                  </button>

                </div>
              </div>

              <div className="space-y-1.5">
                <input
                  name="price"
                  type="number"
                  placeholder={
                    formData.type === "sell"
                      ? "Sale Price (₹)"
                      : "Rent per Day (₹)"
                  }
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm font-semibold text-[#8C5D30] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* =========================================
              LOCATION + IMAGE
          ========================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LOCATION */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E0D5C5] shadow-xs space-y-5">

              <h2 className="text-base font-serif font-bold text-[#2C221E] flex items-center gap-2 pb-3 border-b border-[#E8DFD1]">
                <MapPin className="text-[#8C5D30]" size={18} />
                Location
              </h2>

              <div className="space-y-3.5">

                {/* CITY + AREA */}
                <div className="flex gap-3">

                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-1/2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                  />

                  <input
                    name="area"
                    placeholder="Area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-1/2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                  />

                </div>

                {/* LOCATION BUTTON */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={gettingLocation}
                  className={`w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${
                    formData.coordinates.lat
                      ? "bg-[#E8EAE3] text-[#3D4F41] border-[#C5CDC6]"
                      : "bg-[#F3ECE0] text-[#704A33] border-[#E0D5C5] hover:bg-[#EFE8DC]"
                  }`}
                >
                  {gettingLocation ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={16}
                      />
                      Detecting Location...
                    </>
                  ) : formData.coordinates.lat ? (
                    <>
                      <CheckCircle2 size={16} />
                      Location Captured
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      Use Current Location
                    </>
                  )}
                </button>

                {/* SUCCESS MESSAGE */}
                {locationMessage && (
                  <div className="flex items-center gap-2 text-xs font-medium text-[#3D4F41] bg-[#E8EAE3] border border-[#C5CDC6] rounded-lg px-3 py-2">
                    <CheckCircle2 size={15} />
                    {locationMessage}
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {locationError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {locationError}
                  </div>
                )}

              </div>
            </div>

            {/* BOOK COVER */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E0D5C5] shadow-xs space-y-4 text-center">

              <h2 className="text-base font-serif font-bold text-[#2C221E] flex items-center justify-center gap-2 pb-3 border-b border-[#E8DFD1]">
                <ImageIcon className="text-[#8C5D30]" size={18} />
                Book Cover
              </h2>

              <div className="relative group h-36 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E0D5C5] flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-[#8C5D30]">

                {formData.image ? (
                  <img
                    src={formData.image}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#8C7A6B]">

                    {uploading ? (
                      <Loader2
                        className="animate-spin mb-2"
                        size={20}
                      />
                    ) : (
                      <UploadCloud
                        size={24}
                        className="mb-1.5 text-[#8C5D30]"
                      />
                    )}

                    <p className="text-xs font-semibold uppercase tracking-wider">
                      {uploading
                        ? "Uploading..."
                        : "Click to Upload"}
                    </p>

                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

              </div>
            </div>
          </div>

          {/* =========================================
              CONTACT INFORMATION
          ========================================= */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E0D5C5] shadow-xs space-y-5">

            <h2 className="text-base font-serif font-bold text-[#2C221E] flex items-center gap-2 pb-3 border-b border-[#E8DFD1]">
              <User className="text-[#8C5D30]" size={18} />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* NAME */}
              <div className="relative">

                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                  size={16}
                />

                <input
                  name="sellerName"
                  placeholder="Full Name *"
                  value={formData.sellerName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />

              </div>

              {/* PHONE */}
              <div className="relative">

                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                  size={16}
                />

                <input
                  name="sellerPhone"
                  placeholder="Phone Number *"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />

              </div>

              {/* EMAIL */}
              <div className="relative">

                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                  size={16}
                />

                <input
                  name="sellerEmail"
                  placeholder="Email (Optional)"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl text-sm text-[#2C221E] placeholder:text-[#A09083] outline-none transition-all shadow-xs"
                />

              </div>

            </div>
          </div>

          {/* =========================================
              SUBMIT
          ========================================= */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-[#3D281D] text-[#FAF7F2] py-3.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A1B13] transition-colors disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <CheckCircle2 size={18} />
            )}

            <span>
              {loading
                ? "Creating Listing..."
                : "Publish Listing"}
            </span>
          </button>

        </form>
      </div>
    </div>
  );
}