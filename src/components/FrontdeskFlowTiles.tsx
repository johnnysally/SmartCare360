// FrontdeskFlowTiles removed — no-op stub retained to avoid import errors while cleaning up
export default function FrontdeskFlowTiles() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-4">
      {/* Grid: more columns on large screens so layout is wider and shorter vertically */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <button
            key={t.key}
            className="flex items-center justify-center flex-col text-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all p-3 h-20 sm:h-24"
            type="button"
            title={t.hint}
          >
            <div className="text-lg font-semibold leading-tight truncate">{t.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{t.hint}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
const tiles = [
  { key: 'register', title: 'Register Patient', hint: 'New registration' },
  { key: 'checkin', title: 'Check-in', hint: 'Patient check-in' },
  { key: 'admit', title: 'Admit Patient', hint: 'Start admission' },
  { key: 'appointments', title: 'Appointments', hint: 'Book / view' },
  { key: 'queue', title: 'Queue', hint: 'Manage queue' },
  { key: 'billing', title: 'Billing', hint: 'Payments & invoices' },
  { key: 'pharmacy', title: 'Pharmacy', hint: 'Prescriptions' },
  { key: 'reports', title: 'Reports', hint: 'Quick reports' },
]
}
