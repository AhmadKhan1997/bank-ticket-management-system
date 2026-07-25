export function findNextTicket(queueList) {
  if (queueList.length === 0) {
    return null;
  }

  let bestTicket = queueList[0];

  for (let i = 1; i < queueList.length; i++) {
    const ticket = queueList[i];

    if (ticket.skipCount < bestTicket.skipCount) {
      bestTicket = ticket;
    } else if (ticket.skipCount === bestTicket.skipCount) {
      if (ticket.createdOrder < bestTicket.createdOrder) {
        bestTicket = ticket;
      }
    }
  }

  return bestTicket;
}

export function removeTicketFromQueue(queueList, ticketId) {
  const newQueue = [];

  for (let i = 0; i < queueList.length; i++) {
    if (queueList[i].id !== ticketId) {
      newQueue.push(queueList[i]);
    }
  }

  return newQueue;
}