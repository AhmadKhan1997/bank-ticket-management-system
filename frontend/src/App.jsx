import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AgentDashboardPage from "./pages/AgentDashboardPage";
import TicketGenerationPage from "./pages/TicketGenerationPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketGenerationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/agent"
          element={
            <ProtectedRoute requiredRole="AGENT">
              <AgentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;