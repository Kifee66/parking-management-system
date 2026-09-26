function HistoryTable({ transactions }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Parking History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2">Transaction</th>
              <th className="px-3 py-2">Registration</th>
              <th className="px-3 py-2">Slot</th>
              <th className="px-3 py-2">Entry</th>
              <th className="px-3 py-2">Exit</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="px-3 py-3">{item.id}</td>
                <td className="px-3 py-3">{item.registrationNo}</td>
                <td className="px-3 py-3">{item.slot}</td>
                <td className="px-3 py-3">{new Date(item.entryTime).toLocaleString()}</td>
                <td className="px-3 py-3">{item.exitTime ? new Date(item.exitTime).toLocaleString() : '—'}</td>
                <td className="px-3 py-3">{item.durationMinutes || 0} min</td>
                <td className="px-3 py-3">KES {item.amountDue.toLocaleString()}</td>
                <td className="px-3 py-3">
                  <span className={["rounded-full px-2 py-1 text-xs font-semibold", item.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'].join(' ')}>
                    {item.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryTable
