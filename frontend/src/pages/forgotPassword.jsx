import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
      setMessage("Check your inbox! We've sent instructions to reset your password.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] text-[#2C221E] px-4 py-12 selection:bg-[#E8DFD1]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-[#2C221E]/5 p-8 md:p-10 border border-[#E0D5C5]">
        
        {/* ICON & HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] mb-4 shadow-sm">
            <KeyRound size={22} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2C221E]">Forgot Password?</h2>
          <p className="text-sm text-[#63534B] font-sans mt-2 leading-relaxed">
            No worries, it happens. Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleReset}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33] ml-0.5">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E0D5C5] focus:border-[#704A33] focus:bg-white rounded-xl outline-none transition-all text-sm text-[#2C221E] placeholder:text-[#A09083] shadow-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="w-full bg-[#3D281D] text-[#FAF7F2] py-3.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A1B13] transition-colors disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : status === "success" ? (
              <CheckCircle2 size={18} />
            ) : null}
            {status === "loading" ? "Sending..." : status === "success" ? "Email Sent" : "Send Reset Link"}
          </button>
        </form>

        {/* FEEDBACK MESSAGE */}
        {message && (
          <div className={`mt-5 p-3.5 rounded-xl text-xs font-medium flex gap-2.5 items-center ${
            status === "success" 
              ? "bg-[#E8EAE3] text-[#3D4F41] border border-[#C5CDC6]" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {status === "success" && <CheckCircle2 size={16} className="shrink-0" />}
            <span>{message}</span>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-[#E8DFD1]">
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-sm text-[#63534B] font-medium hover:text-[#2C221E] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}