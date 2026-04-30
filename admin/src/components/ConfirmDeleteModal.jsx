const ConfirmDeleteModal = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),linear-gradient(135deg,rgba(0,0,0,0.18),transparent_60%)]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-white/40 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <div className="h-2 bg-linear-to-r from-red-500 via-orange-400 to-amber-300" />

        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl shadow-inner">
              🗑️
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
                Confirm deletion
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center rounded-full border border-red-500 bg-linear-to-r from-red-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:brightness-95"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
