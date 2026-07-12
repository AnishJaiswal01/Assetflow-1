const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md px-2 py-1 text-lg leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">×</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
