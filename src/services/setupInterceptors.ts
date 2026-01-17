import { api } from "./api";
import { mfaApi } from "./mfaApi";

let getAccessToken: () => string | null;
let getTempToken: () => string | null;

export function setupAuthInterceptors(
  accessTokenFn: () => string | null,
  tempTokenFn: () => string | null
) {
  getAccessToken = accessTokenFn;
  getTempToken = tempTokenFn;

  api.interceptors.request.use((config) => {
    const token = getAccessToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  mfaApi.interceptors.request.use((config) => {
    const token = getTempToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
