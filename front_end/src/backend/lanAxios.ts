import axios from "axios";
import { BASE_API_URL } from "./backEndConfig";

/**
 * A axios used for this application.
 */
const LAN_AXIOS = axios.create({
  baseURL: BASE_API_URL,
  headers: { 'Content-type': 'application/json' },
});

export default LAN_AXIOS;
