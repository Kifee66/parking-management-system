import ParkingSlot from './ParkingSlot'

function ParkingGrid({ slots, selectedSlot, onSelectSlot }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500" /> Occupied
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-500" /> Selected
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot.slotNumber}
            slot={slot}
            selected={selectedSlot?.slotNumber === slot.slotNumber}
            onSelect={onSelectSlot}
          />
        ))}
      </div>
    </div>
  )
}

export default ParkingGrid
