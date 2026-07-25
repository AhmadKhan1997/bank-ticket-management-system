import apiClient from "./api";
import publicApiClient from "./publicApi";

export async function getAllTickets() {
  const response = await apiClient.get("/tickets/");
  return response.data;
}

export async function getAllCategories() {
  const response = await publicApiClient.get("/categories/");
  return response.data;
}

export async function callNextTicket(counterId) {
  const response = await apiClient.post("/tickets/call-next/", {
    counter_id: counterId,
  });
  return response.data;
}

export async function skipTicket(ticketId) {
  const response = await apiClient.post("/tickets/" + ticketId + "/skip/");
  return response.data;
}

export async function noShowTicket(ticketId) {
  const response = await apiClient.post("/tickets/" + ticketId + "/no-show/");
  return response.data;
}

export async function openTicket(ticketId) {
  const response = await apiClient.post("/tickets/" + ticketId + "/open/");
  return response.data;
}

export async function completeTicket(ticketId, problemText, solutionText, feedbackText) {
  const response = await apiClient.post("/tickets/" + ticketId + "/complete/", {
    problem_description: problemText,
    solution_provided: solutionText,
    feedback: feedbackText,
  });
  return response.data;
}

export async function createTicket(categoryId, ticketNumber) {
  const response = await publicApiClient.post("/tickets/", {
    category: categoryId,
    ticket_number: ticketNumber,
  });
  return response.data;
}

export async function updateCounter(counterId, categoryIds) {
  const response = await apiClient.patch("/counters/" + counterId + "/", {
    categories: categoryIds,
  });
  return response.data;
}

export async function getAllCounters() {
  const response = await apiClient.get("/counters/");
  return response.data;
}