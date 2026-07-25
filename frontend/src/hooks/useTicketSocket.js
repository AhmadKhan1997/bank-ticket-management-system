import { useEffect, useRef } from "react";

export function useTicketSocket(onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(function () {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/tickets/");
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