import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label className="block text-sm font-medium text-slate-700">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-3 ${errors.email ? "border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`} />{errors.email && <span className="mt-1.5 block text-xs font-medium text-rose-700">{errors.email}</span>}</label>
      <label className="block text-sm font-medium text-slate-700">Password<span className="relative mt-1.5 block"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className={`h-11 w-full rounded-lg border bg-white py-2 pl-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-3 ${errors.password ? "border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <span className="mt-1.5 block text-xs font-medium text-rose-700">{errors.password}</span>}</label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />Remember me on this device</label>
      <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200 disabled:cursor-wait disabled:bg-blue-500">{isLoading ? "Signing in..." : "Sign In"}</button>
    </form>
  );
};

export default LoginForm;
