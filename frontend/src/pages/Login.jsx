import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.setTimeout(() => navigate("/dashboard"), 800);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgb(15_23_42/0.10)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold shadow-sm">AF</span><span className="text-xl font-semibold tracking-tight">AssetFlow</span></div>
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Enterprise operations</p><h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight">Every asset, allocation and audit in one reliable workspace.</h1><p className="mt-5 max-w-md text-base leading-7 text-slate-300">A focused system for teams that need clear ownership, predictable maintenance and verifiable asset records.</p></div>
          <p className="text-sm text-slate-400">AssetFlow · Enterprise Asset Management System</p>
        </section>
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md"><div className="lg:hidden"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">AF</span><span className="text-xl font-semibold tracking-tight text-slate-900">AssetFlow</span></div></div><div className="mt-10"><span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Demo Mode</span><h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to access the AssetFlow Enterprise Asset Management System.</p></div><div className="mt-8"><LoginForm onSubmit={handleLogin} isLoading={isLoading} /></div><div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Demo credentials</p><dl className="mt-3 space-y-1.5 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Role</dt><dd className="font-medium text-slate-800">Administrator</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-800">admin@assetflow.com</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Password</dt><dd className="font-medium text-slate-800">admin123</dd></div></dl></div><p className="mt-5 text-center text-xs leading-5 text-slate-400">Authentication will be connected during backend integration.</p></div>
        </section>
      </div>
    </main>
  );
};

export default Login;
