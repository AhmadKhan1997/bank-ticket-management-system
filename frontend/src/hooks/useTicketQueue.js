import { useState, useEffect } from "react";
import {
  getAllTickets,
  callNextTicket,
  skipTicket,
  noShowTicket,
  openTicket,
  completeTicket,
} from "../services/ticketService";
import { playTicketAnnouncement } from "../services/textToSpeech";
import { useTicketSocket } from "./useTicketSocket";

const COUNTER_ID = 1;

export function useTicketQueue() {
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    loadTickets();
  }, []);

  useTicketSocket(function (message) {
    loadTickets();
  });

  

  async function loadTickets() {
    setIsLoading(true);
    try {
      const allTickets = await getAllTickets();

      const waiting = [];
      let active = null;

      for (let i = 0; i < allTickets.length; i++) {
        const ticket = allTickets[i];

        if (ticket.status === "WAITING") {
          waiting.push(ticket);
        } else if (ticket.status === "CALLED") {
          active = ticket;
        } else if (ticket.status === "IN_PROGRESS") {
          active = ticket;
        }
      }

      setWaitingQueue(waiting);
      setCurrentTicket(active);

      if (active !== null && active.status === "IN_PROGRESS") {
        setIsTicketOpen(true);
      } else {
        setIsTicketOpen(false);
      }
    } catch (error) {
      setStatusMessage("Could not load tickets from the server.");
    }
    setIsLoading(false);
  }

  async function handleCallNextTicket() {
    if (currentTicket !== null) {
      setStatusMessage("Finish the current ticket before calling the next one.");
      return;
    }

    try {
      const newTicket = await callNextTicket(COUNTER_ID);
      setCurrentTicket(newTicket);
      setIsTicketOpen(false);
      await loadTickets();
      await speakAnnouncement(newTicket.ticket_number);
    } catch (error) {
      setStatusMessage("No tickets waiting, or something went wrong.");
    }
  }

  async function handleReplayAnnouncement() {
    if (currentTicket === null) {
      setStatusMessage("There is no active ticket to announce.");
      return;
    }
    await speakAnnouncement(currentTicket.ticket_number);
  }

  async function speakAnnouncement(ticketNumber) {
    const success = await playTicketAnnouncement(ticketNumber);
    if (success === false) {
      setStatusMessage("Could not play audio announcement.");
    }
  }

  async function handleOpenTicket() {
    if (currentTicket === null) {
      return;
    }

    try {
      const updatedTicket = await openTicket(currentTicket.id);
      setCurrentTicket(updatedTicket);
      setIsTicketOpen(true);
    } catch (error) {
      setStatusMessage("Could not open the ticket.");
    }
  }

  async function handleSkipTicket() {
    if (currentTicket === null) {
      return;
    }

    try {
      await skipTicket(currentTicket.id);
      setStatusMessage(currentTicket.ticket_number + " was skipped and moved back into the queue.");
      setCurrentTicket(null);
      setIsTicketOpen(false);
      await loadTickets();
    } catch (error) {
      setStatusMessage("Could not skip the ticket.");
    }
  }

  async function handleNoShowTicket() {
    if (currentTicket === null) {
      return;
    }

    try {
      await noShowTicket(currentTicket.id);
      setStatusMessage(currentTicket.ticket_number + " marked as no-show and closed.");
      setCurrentTicket(null);
      setIsTicketOpen(false);
      await loadTickets();
    } catch (error) {
      setStatusMessage("Could not mark the ticket as no-show.");
    }
  }

  async function handleCompleteTicket(problemText, solutionText, feedbackText) {
    if (currentTicket === null) {
      return;
    }

    if (problemText.trim() === "" || solutionText.trim() === "") {
      setStatusMessage("Please fill in the problem and solution before closing.");
      return;
    }

    try {
      await completeTicket(currentTicket.id, problemText, solutionText, feedbackText);
      setStatusMessage(currentTicket.ticket_number + " completed and closed.");
      setCurrentTicket(null);
      setIsTicketOpen(false);
      await loadTickets();
    } catch (error) {
      setStatusMessage("Could not complete the ticket.");
    }
  }

  return {
    waitingQueue,
    currentTicket,
    isTicketOpen,
    statusMessage,
    isLoading,
    handleCallNextTicket,
    handleReplayAnnouncement,
    handleOpenTicket,
    handleSkipTicket,
    handleNoShowTicket,
    handleCompleteTicket,
  };
}