import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { createAgentAsAdmin, deleteAgentAsAdmin } from "../services/adminApi";

export default function AgentManagement({ agents, onAgentsChanged }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAddAgent() {
    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      await createAgentAsAdmin(username, firstName, lastName, email, password);
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setErrorMessage("");
      onAgentsChanged();
    } catch (error) {
      setErrorMessage("Could not create agent. Username may already exist.");
    }
  }

  async function handleDeleteAgent(agentId) {
    try {
      await deleteAgentAsAdmin(agentId);
      onAgentsChanged();
    } catch (error) {
      setErrorMessage("Could not delete agent.");
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm font-medium text-slate-700 mb-4">Agents</p>

      {errorMessage !== "" && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2 mb-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm text-slate-700">{agent.username}</p>
              <p className="text-xs text-slate-400">{agent.first_name} {agent.last_name}</p>
            </div>
            <button
              onClick={() => handleDeleteAgent(agent.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2">
        <p className="text-xs text-slate-400 mb-2">Add new agent</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleAddAgent}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Add agent
        </button>
      </div>
    </div>
  );
}