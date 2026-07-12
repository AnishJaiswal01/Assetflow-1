const Snackbar = ({ message }) => {
  if (!message) return null;

  return (
    <div role="status" className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
};

export default Snackbar;
