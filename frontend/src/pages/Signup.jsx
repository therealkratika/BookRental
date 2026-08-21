import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthSDK } from '../Api/sdk';
import { User, Mail, Lock, Loader2, ArrowRight, Library } from 'lucide-react';

export default function Signup() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }
    try {
      await AuthSDK.signup({
        username: data.username,
        email: data.email,
        password: data.password
      });
      navigate("/login");
    } catch (err) {
      setError("root", {
        message: err.message || "Signup failed"
      });
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
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2C221E]">Get Started</h2>
            <p className="text-sm text-[#63534B] mt-1.5 font-sans">Create your account to start reading</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33] ml-0.5">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="username"
                  className={`block w-full bg-[#FAF7F2] border ${
                    errors.username ? "border-red-300" : "border-[#E0D5C5]"
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
              {errors.username && <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.username.message}</p>}
            </div>

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
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
                  })}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33] ml-0.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className={`block w-full bg-[#FAF7F2] border ${
                    errors.password ? "border-red-300" : "border-[#E0D5C5]"
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                />
              </div>
              {errors.password && <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#704A33] ml-0.5">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6B] group-focus-within:text-[#704A33] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className={`block w-full bg-[#FAF7F2] border ${
                    errors.confirmPassword ? "border-red-300" : "border-[#E0D5C5]"
                  } focus:border-[#704A33] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2C221E] placeholder:text-[#A09083] transition-all outline-none shadow-xs`}
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs font-medium text-red-600 ml-0.5 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Root Error Display */}
            {errors.root && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs font-medium text-red-700 text-center">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#3D281D] text-[#FAF7F2] py-3.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A1B13] transition-colors disabled:opacity-70 disabled:pointer-events-none !mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center pt-6 border-t border-[#E8DFD1]">
            <p className="text-sm text-[#63534B]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#8C5D30] font-semibold hover:text-[#2C221E] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}