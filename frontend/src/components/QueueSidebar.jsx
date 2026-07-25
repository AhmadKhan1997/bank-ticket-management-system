export default function QueueSidebar({ waitingQueue }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm font-medium text-slate-700 mb-4">Waiting queue</p>

      {waitingQueue.length === 0 && (
        <p className="text-sm text-slate-400">Queue is empty.</p>
      )}

      <div className="space-y-2">
        {waitingQueue.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">{ticket.ticket_number}</p>
              <p className="text-xs text-slate-400">{ticket.category_name}</p>
            </div>
            {ticket.skipCount > 0 && (
              <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                skipped {ticket.skip_count}x
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}