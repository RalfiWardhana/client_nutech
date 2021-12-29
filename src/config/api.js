import axios from "axios";

// Create base URL API
export const API = axios.create({
  baseURL: "https://nutech12345.herokuapp.com/api/v1" || "http://localhost:2022/api/v1"
});

// Set Authorization Token Header
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};