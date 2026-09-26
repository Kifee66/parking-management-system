function DashboardSummary({ totalSlots, availableSlots, occupiedSlots, revenue }) {
  const cards = [
    { label: 'Total Slots', value: totalSlots, accent: 'bg-sky-50 text-sky-900' },
    { label: 'Available Slots', value: availableSlots, accent: 'bg-emerald-50 text-emerald-900' },
    { label: 'Occupied Slots', value: occupiedSlots, accent: 'bg-rose-50 text-rose-900' },
    { label: "Today's Revenue", value: `KES ${revenue.toLocaleString()}`, accent: 'bg-amber-50 text-amber-900' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-2xl border border-slate-200 p-5 ${card.accent}`}>
          <div className="text-sm font-medium uppercase tracking-wide">{card.label}</div>
          <div className="mt-3 text-3xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  )
}

export default DashboardSummary
