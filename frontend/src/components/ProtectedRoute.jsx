import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { getCurrentUser } from "../services/agentService";

export default function ProtectedRoute({ children, requiredRole }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(function () {
    checkAccess();
  }, []);

  async function checkAccess() {
    if (isLoggedIn() === false) {
      setHasAccess(false);
      setIsChecking(false);
      return;
    }

    if (requiredRole === undefined) {
      setHasAccess(true);
      setIsChecking(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      if (currentUser.role === requiredRole) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      setHasAccess(false);
    }
    setIsChecking(false);
  }

  if (isChecking === true) {
    return <div className="p-6 text-sm text-slate-500">Checking access...</div>;
  }

  if (hasAccess === false) {
    return <Navigate to="/login" />;
  }

  return children;
}