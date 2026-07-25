import { useState, useEffect } from "react";
import {
  getAllTicketsAsAdmin,
  getAllCountersAsAdmin,
  getAllCategoriesAsAdmin,
  getAllAgentsAsAdmin,
} from "../services/adminApi";
import FloorOverview from "../components/FloorOverview";
import AgentManagement from "../components/AgentManagement";
import CounterSettings from "../components/CounterSettings";
import { useTicketSocket } from "../hooks/useTicketSocket";

export default function AdminPanelPage() {
  const [tickets, setTickets] = useState([]);
  const [counters, setCounters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(function () {
    loadAllData();
  }, []);


  useTicketSocket(function (message) {
      loadAllData();
    });

  async function loadAllData() {
    try {
      const ticketsResult = await getAllTicketsAsAdmin();
      const countersResult = await getAllCountersAsAdmin();
      const categoriesResult = await getAllCategoriesAsAdmin();
      const agentsResult = await getAllAgentsAsAdmin();

      setTickets(ticketsResult);
      setCounters(countersResult);
      setCategories(categoriesResult);
      setAgents(agentsResult);
    } catch (error) {
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Admin panel</h1>
        </div>

        <FloorOverview tickets={tickets} counters={counters} />

        <div className="grid grid-cols-2 gap-6">
          <AgentManagement agents={agents} onAgentsChanged={loadAllData} />
          <CounterSettings counters={counters} categories={categories} onCountersChanged={loadAllData} />
        </div>
      </div>
    </div>
  );
}