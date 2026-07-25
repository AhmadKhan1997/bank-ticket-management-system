import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function TicketForm({ currentTicket, onComplete }) {
  const [problemText, setProblemText] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  function handleSubmit() {
    onComplete(problemText, solutionText, feedbackText);
    setProblemText("");
    setSolutionText("");
    setFeedbackText("");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Ticket open</p>
          <p className="text-3xl font-semibold text-slate-800">{currentTicket.ticket_number}</p>
          <p className="text-sm text-slate-500 mt-1">{currentTicket.category_name}</p>
        </div>
        <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
          In progress
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Problem</label>
          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            rows={2}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What did the customer come in for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Solution provided</label>
          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            rows={2}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How was it resolved?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={2}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4" />
          Complete ticket
        </button>
      </div>
    </div>
  );
}