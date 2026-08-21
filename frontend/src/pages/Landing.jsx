import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookSDK } from "../Api/bookSDK";
import { 
  ArrowRight, 
  Library, 
  Banknote, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Code, 
  Microscope, 
  History, 
  Layers 
} from "lucide-react";

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await BookSDK.getAll();
        setBooks(res || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const categories = [
    { name: "Fiction", icon: <BookOpen className="w-5 h-5" />, color: "bg-[#F3ECE0] text-[#704A33]" },
    { name: "Programming", icon: <Code className="w-5 h-5" />, color: "bg-[#EAE2D6] text-[#523A28]" },
    { name: "Science", icon: <Microscope className="w-5 h-5" />, color: "bg-[#E8EAE3] text-[#3D4F41]" },
    { name: "History", icon: <History className="w-5 h-5" />, color: "bg-[#F5EAD8] text-[#8C5D30]" },
    { name: "Other", icon: <Layers className="w-5 h-5" />, color: "bg-[#EFEFEF] text-[#555555]" },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#2C221E] selection:bg-[#E8DFD1]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-28 border-b border-[#E8DFD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase bg-[#EFE8DC] text-[#704A33] border border-[#DFCFC0]">
                <span>✨</span> Premium Book Exchange
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif text-[#2C221E] leading-[1.15]">
                Read More, <br />
                <em className="italic font-normal text-[#8C5D30]">Spend Less.</em>
              </h1>

              <p className="text-base sm:text-lg text-[#63534B] max-w-lg leading-relaxed font-sans">
                Join a thoughtful community of readers. Buy, rent, or pass on your favorite books at prices that make sense.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  to="/signup?rentOnly=true" 
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#3D281D] text-[#FAF7F2] font-medium hover:bg-[#2A1B13] transition-colors shadow-sm"
                >
                  Rent Books <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link 
                  to="/books" 
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-white text-[#3D281D] font-medium border border-[#DCD0C0] hover:bg-[#F3ECE0] transition-colors shadow-sm"
                >
                  Buy Used Books
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8DFD1]">
                {[
                  { label: "Available Books", val: `${books.length}+` },
                  { label: "Active Readers", val: "1,000+" },
                  { label: "Starting From", val: "₹50" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-serif font-bold text-[#2C221E]">{stat.val}</p>
                    <p className="text-xs text-[#8C7A6B] font-medium uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="p-3 bg-white rounded-2xl border border-[#E8DFD1] shadow-xl shadow-[#2C221E]/5">
                <img
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
                  alt="Library"
                  className="rounded-xl object-cover aspect-[4/3] w-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-[#F3ECE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-[#2C221E]">Designed for Book Lovers</h2>
            <p className="text-sm text-[#63534B] mt-2">Everything you need to keep your personal library fresh without the high cost.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Curated Library", desc: "Thousands of verified pre-loved books ready to read.", icon: <Library className="w-5 h-5" /> },
              { title: "Fair Pricing", desc: "Significantly cheaper than purchasing brand-new titles.", icon: <Banknote className="w-5 h-5" /> },
              { title: "Flexible Rental", desc: "Keep books for as long or as short as your reading pace demands.", icon: <Clock className="w-5 h-5" /> },
              { title: "Earn back", desc: "Pass along old reads and earn credit or cash effortlessly.", icon: <TrendingUp className="w-5 h-5" /> },
            ].map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-[#E0D5C5] shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#704A33] border border-[#E8DFD1] flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-[#2C221E] mb-1.5">{f.title}</h3>
                <p className="text-[#63534B] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-[#2C221E] mb-10">Explore Genres</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/books?category=${cat.name}`}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-[#E0D5C5] hover:border-[#8C5D30] transition-colors shadow-xs"
              >
                <div className={`p-2 rounded-md ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="font-medium text-sm text-[#2C221E]">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED SECTION BANNER --- */}
      <section className="py-16 bg-[#F3ECE0] border-t border-b border-[#E0D5C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2C221E]">Featured Collections</h2>
              <p className="text-[#63534B] text-sm mt-1">Handpicked reads curated by our community of bookworms.</p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#704A33] hover:text-[#2C221E] transition-colors">
              View All Shelf Titles <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- SELL CTA SECTION --- */}
      <section className="px-4 py-20 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#3D281D] p-10 lg:p-14 text-center relative overflow-hidden shadow-xl text-[#FAF7F2]">
          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl md:text-4xl font-serif">
              Have Books Sitting on Your Shelf?
            </h2>
            <p className="text-[#DCD0C0] text-base max-w-lg mx-auto leading-relaxed font-sans">
              Declutter your space and give your stories a second life. List your pre-loved books securely in under two minutes.
            </p>
            <div className="pt-2">
              <Link 
                to="/add-book" 
                className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#FAF7F2] text-[#3D281D] font-medium text-sm hover:bg-[#EFE8DC] transition-colors shadow-sm"
              >
                Start Selling Today <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}