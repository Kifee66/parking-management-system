function BarrierSimulation({ barrierState, paymentStatus }) {
  const stateColors = {
    CLOSED: 'bg-rose-100 text-rose-700 border-rose-300',
    'PAYMENT REQUIRED': 'bg-amber-100 text-amber-700 border-amber-300',
    'PAYMENT PROCESSING': 'bg-sky-100 text-sky-700 border-sky-300',
    OPEN: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'VEHICLE EXITED': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Barrier Simulation</h2>

      <div className="mt-5 flex items-center justify-center">
        <div className="w-full max-w-xs rounded-2xl border-2 border-slate-200 bg-slate-100 p-4">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Barrier</span>
            <span>{paymentStatus || 'Pending'}</span>
          </div>

          <div className={[
            'rounded-xl border px-3 py-2 text-center text-sm font-semibold',
            stateColors[barrierState] || stateColors.CLOSED,
          ].join(' ')}>
            {barrierState}
          </div>

          <div className="mt-4 h-16 rounded-xl bg-slate-300 p-2">
            <div
              className={[
                'h-full rounded-lg transition-all duration-300',
                barrierState === 'OPEN' || barrierState === 'VEHICLE EXITED'
                  ? 'w-full bg-emerald-500'
                  : 'w-1/2 bg-slate-500',
              ].join(' ')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarrierSimulation
