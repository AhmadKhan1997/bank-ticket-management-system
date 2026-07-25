import { useEffect, useRef } from "react";

export function useTicketSocket(onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(function () {
    const socket = new WebSocket(import.meta.env.VITE_WS_BASE_URL);
    socketRef.current = socket;

    socket.onopen = function () {
      console.log("WebSocket connected");
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      onMessageReceived(data);
    };

    socket.onclose = function () {
      console.log("WebSocket disconnected");
    };

    socket.onerror = function (error) {
      console.log("WebSocket error", error);
    };

    return function cleanup() {
      socket.close();
    };
  }, []);
}