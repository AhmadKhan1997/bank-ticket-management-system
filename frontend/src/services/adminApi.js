import axios from "axios";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let cachedAdminToken = null;

async function fetchNewAdminToken() {
  const response = await axios.post(import.meta.env.VITE_API_BASE_URL + "/token/", {    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });
  cachedAdminToken = response.data.access;
  return cachedAdminToken;
}

async function getAdminToken() {
  if (cachedAdminToken === null) {
    return await fetchNewAdminToken();
  }
  return cachedAdminToken;
}

adminClient.interceptors.request.use(async function (config) {
  const token = await getAdminToken();
  config.headers.Authorization = "Bearer " + token;
  return config;
});

adminClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && originalRequest._retry !== true) {
      originalRequest._retry = true;

      const newToken = await fetchNewAdminToken();
      originalRequest.headers.Authorization = "Bearer " + newToken;
      return adminClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export async function getAllTicketsAsAdmin() {
  const response = await adminClient.get("/tickets/");
  return response.data;
}

export async function getAllCountersAsAdmin() {
  const response = await adminClient.get("/counters/");
  return response.data;
}

export async function getAllCategoriesAsAdmin() {
  const response = await adminClient.get("/categories/");
  return response.data;
}

export async function getAllAgentsAsAdmin() {
  const response = await adminClient.get("/agents/");
  return response.data;
}

export async function createAgentAsAdmin(username, firstName, lastName, email, password) {
  const response = await adminClient.post("/agents/", {
    username: username,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  });
  return response.data;
}

export async function deleteAgentAsAdmin(agentId) {
  const response = await adminClient.delete("/agents/" + agentId + "/");
  return response.data;
}

export async function updateCounterAsAdmin(counterId, categoryIds) {
  const response = await adminClient.patch("/counters/" + counterId + "/", {
    categories: categoryIds,
  });
  return response.data;
}