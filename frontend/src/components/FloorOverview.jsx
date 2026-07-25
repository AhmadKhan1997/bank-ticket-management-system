import { Circle } from "lucide-react";

export default function FloorOverview({ tickets, counters }) {
  let waitingCount = 0;
  let calledCount = 0;
  let inProgressCount = 0;

  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].status === "WAITING") {
      waitingCount = waitingCount + 1;
    } else if (tickets[i].status === "CALLED") {
      calledCount = calledCount + 1;
    } else if (tickets[i].status === "IN_PROGRESS") {
      inProgressCount = inProgressCount + 1;
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs text-slate-400 mb-1">Waiting</p>
        <p className="text-2xl font-semibold text-slate-800">{waitingCount}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs text-slate-400 mb-1">Called</p>
        <p className="text-2xl font-semibold text-slate-800">{calledCount}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs text-slate-400 mb-1">In progress</p>
        <p className="text-2xl font-semibold text-slate-800">{inProgressCount}</p>
      </div>

      <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm font-medium text-slate-700 mb-4">Active counters</p>
        <div className="space-y-2">
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Circle
                  className={
                    counter.current_agent === null
                      ? "w-2 h-2 fill-slate-300 text-slate-300"
                      : "w-2 h-2 fill-emerald-500 text-emerald-500"
                  }
                />
                <span className="text-sm text-slate-700">Counter {counter.number}</span>
              </div>
              <span className="text-xs text-slate-400">
                {counter.current_agent === null ? "Unattended" : "Active"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}