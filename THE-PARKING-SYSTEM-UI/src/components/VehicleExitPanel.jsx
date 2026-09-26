function VehicleExitPanel({ vehicle, onExit, loading }) {
  if (!vehicle) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Vehicle Exit</h2>
        <p className="mt-3 text-sm text-slate-600">Search for a parked vehicle to calculate the bill and process exit.</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Exit Details</h2>

      <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div><span className="font-semibold">Registration:</span> {vehicle.registrationNo}</div>
        <div><span className="font-semibold">Vehicle Type:</span> {vehicle.vehicleType}</div>
        <div><span className="font-semibold">Slot:</span> {vehicle.slotNumber}</div>
        <div><span className="font-semibold">Entry Time:</span> {new Date(vehicle.entryTime).toLocaleString()}</div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="text-sm text-slate-600">Amount Due</div>
        <div className="mt-1 text-3xl font-bold text-slate-900">KES {vehicle.amountDue.toLocaleString()}</div>
      </div>

      <button
        type="button"
        onClick={onExit}
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Processing Payment...' : 'Confirm Payment and Exit'}
      </button>
    </div>
  )
}

export default VehicleExitPanel
