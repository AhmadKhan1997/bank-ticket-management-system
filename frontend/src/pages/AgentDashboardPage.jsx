import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logoutUser } from "../services/authService";
import { Users } from "lucide-react";
import { useTicketQueue } from "../hooks/useTicketQueue";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";
import QueueSidebar from "../components/QueueSidebar";

export default function AgentDashboardPage() {
  const {
    waitingQueue,
    currentTicket,
    isTicketOpen,
    statusMessage,
    handleCallNextTicket,
    handleReplayAnnouncement,
    handleOpenTicket,
    handleSkipTicket,
    handleNoShowTicket,
    handleCompleteTicket,
  } = useTicketQueue();

  const navigate = useNavigate();
  function handleLogout() {
  logoutUser();
  navigate("/login");
}

  let freshTicketCount = 0;
  for (let i = 0; i < waitingQueue.length; i++) {
    if (waitingQueue[i].skip_count === 0) {
      freshTicketCount = freshTicketCount + 1;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Agent dashboard</h1>
            <p className="text-sm text-slate-500">Counter 3 &middot; Agent: Sarah Malik</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{waitingQueue.length} waiting</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-600">{freshTicketCount} not yet skipped</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>

        {statusMessage !== "" && (
          <div className="mb-4 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-2">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6">
            {isTicketOpen === false && (
              <TicketCard
                currentTicket={currentTicket}
                onCallNext={handleCallNextTicket}
                onReplayAnnouncement={handleReplayAnnouncement}
                onOpenTicket={handleOpenTicket}
                onSkip={handleSkipTicket}
                onNoShow={handleNoShowTicket}
              />
            )}

            {isTicketOpen === true && (
              <TicketForm currentTicket={currentTicket} onComplete={handleCompleteTicket} />
            )}
          </div>

          <QueueSidebar waitingQueue={waitingQueue} />
        </div>
      </div>
    </div>
  );
}