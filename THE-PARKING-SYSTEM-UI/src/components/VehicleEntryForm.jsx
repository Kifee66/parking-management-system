function VehicleEntryForm({ slots, onSubmit, submitting }) {
  const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE')

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">Vehicle Entry</h2>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
          {availableSlots.length} slots available
        </span>
      </div>

      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          onSubmit({
            registrationNo: formData.get('registrationNo'),
            vehicleType: formData.get('vehicleType'),
            ownerName: formData.get('ownerName'),
            phoneNumber: formData.get('phoneNumber'),
          })
        }}
      >
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Registration Number
          <input
            name="registrationNo"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:bg-white"
            placeholder="KCA-123A"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Vehicle Type
          <select
            name="vehicleType"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:bg-white"
            defaultValue="Car"
          >
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Truck">Truck</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-1">
          Owner / Driver Name
          <input
            name="ownerName"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:bg-white"
            placeholder="John Doe"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-1">
          Phone Number
          <input
            name="phoneNumber"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:bg-white"
            placeholder="+2547..."
          />
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting || availableSlots.length === 0}
            className="rounded-xl bg-sky-700 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? 'Processing...' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehicleEntryForm
