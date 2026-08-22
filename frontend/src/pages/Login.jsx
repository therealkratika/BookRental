import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthSDK } from "../Api/sdk";
import { Mail, Lock, ArrowRight, Loader2, Library, CheckCircle2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setVerificationSent(false); // Reset status on new submit
      await AuthSDK.login(data.email, data.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Check if error is related to unverified email
      if (err.requiresVerification || err.message?.toLowerCase().includes("verify")) {
        setVerificationSent(true);
      } else {
        setError("email", {
          message: err.message || "Invalid email or password",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF7F2] text-[#2C221E] px-4 py-12 selection:bg-[#E8DFD1]">
      <div className="w-full max-w-md">
        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex flex-col items-center group">
            <div className="w-11 h-11 bg-[#3D281D] rounded-lg flex items-center justify-center text-[#FAF7F2] shadow-sm group-hover:bg-[#2A1B13] transition-colors mb-3">
              <Library size={22} />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#2C221E]">
              Book<span className="text-[#8C5D30]">Hub</span>
            </h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-[#2C221E]/5 border border-[#E0D5C5]">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2C221E]">Welcome Back</h2>
            <p className="text-sm text-[#63534B] mt-1.5 font-sans">Please enter your details to sign in</p>
          </div>

          {/* Green Verification Alert Popup */}
          {verificationSent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                A verification link has been sent to your email. Please check your inbox.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33] ml-0.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full bg-[#FAF7F2] border ${
                    errors.email ? "border-red-300" : "border-[#E0D5C5]"
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33]">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium text-[#8C5D30] hover:text-[#2C221E] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full bg-[#FAF7F2] border ${
                    errors.password ? "border-red-300" : "border-[#E0D5C5]"
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register("password", { required: "Password is required" })}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#3D281D] text-[#FAF7F2] py-3.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A1B13] transition-colors disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center pt-6 border-t border-[#E8DFD1]">
            <p className="text-sm text-[#63534B]">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#8C5D30] font-semibold hover:text-[#2C221E] transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}