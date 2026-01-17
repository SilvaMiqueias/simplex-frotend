import axios from "axios";

export const mfaApi = axios.create({
  baseURL: "http://localhost:8080",
});