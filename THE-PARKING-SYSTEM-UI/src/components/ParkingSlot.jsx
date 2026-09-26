function ParkingSlot({ slot, onSelect, selected, compact = false }) {
  const isAvailable = slot.status === 'AVAILABLE'

  return (
    <button
      type="button"
      onClick={() => onSelect?.(slot)}
      className={[
        'rounded-xl border p-3 text-left transition-all duration-200',
        compact ? 'min-h-[82px]' : 'min-h-[96px]',
        isAvailable
          ? 'border-emerald-400 bg-emerald-50 text-emerald-900 hover:border-emerald-500'
          : 'border-rose-400 bg-rose-50 text-rose-900 hover:border-rose-500',
        selected ? 'ring-2 ring-sky-500 ring-offset-1' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {slot.slotNumber}
        </span>
        <span
          className={[
            'rounded-full px-2 py-1 text-[10px] font-bold uppercase',
            isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white',
          ].join(' ')}
        >
          {isAvailable ? 'Available' : 'Occupied'}
        </span>
      </div>

      <div className="mt-4 text-sm font-medium">
        {isAvailable ? 'Ready for entry' : slot.vehicleId ? 'Vehicle parked' : 'Occupied'}
      </div>
    </button>
  )
}

export default ParkingSlot
