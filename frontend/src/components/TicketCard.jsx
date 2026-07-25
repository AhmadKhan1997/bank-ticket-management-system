import { PhoneCall, Volume2, SkipForward, UserX, DoorOpen, Clock } from "lucide-react";

export default function TicketCard({
  currentTicket,
  onCallNext,
  onReplayAnnouncement,
  onOpenTicket,
  onSkip,
  onNoShow,
}) {
  if (currentTicket === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500 mb-6">No active ticket right now.</p>
        <button
          onClick={onCallNext}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          Call next ticket
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Now serving</p>
          <p className="text-3xl font-semibold text-slate-800">{currentTicket.ticket_number}</p>
          <p className="text-sm text-slate-500 mt-1">{currentTicket.category_name}</p>
        </div>
        <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
          Waiting for customer
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onReplayAnnouncement}
          className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Volume2 className="w-4 h-4" />
          Play announcement again
        </button>

        <button
          onClick={onOpenTicket}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <DoorOpen className="w-4 h-4" />
          Open ticket
        </button>

        <button
          onClick={onSkip}
          className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </button>

        <button
          onClick={onNoShow}
          className="flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <UserX className="w-4 h-4" />
          No show
        </button>
      </div>
    </div>
  );
}