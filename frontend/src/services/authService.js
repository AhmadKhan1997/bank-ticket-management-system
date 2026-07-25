import apiClient from "./api";

export async function loginUser(username, password) {
  const response = await apiClient.post("/token/", {
    username: username,
    password: password,
  });

  const accessToken = response.data.access;
  const refreshToken = response.data.refresh;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("username", username);

  return true;
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
}

export function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return true;
  } else {
    return false;
  }
}