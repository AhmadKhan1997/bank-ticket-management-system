import apiClient from "./api";

export async function getCurrentUser() {
  const response = await apiClient.get("/me/");
  return response.data;
}

export async function getAllAgents() {
  const response = await apiClient.get("/agents/");
  return response.data;
}

export async function createAgent(username, firstName, lastName, email, password) {
  const response = await apiClient.post("/agents/", {
    username: username,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  });
  return response.data;
}

export async function deleteAgent(agentId) {
  const response = await apiClient.delete("/agents/" + agentId + "/");
  return response.data;
}