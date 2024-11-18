// api/client.ts
import axios from "axios";

const API_KEY = "6df9c4e8-11e1-4530-8089-e8acc8b5a569"; 
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-CMC_PRO_API_KEY": API_KEY,
    "Content-Type": "application/json",
  },
});

export default client;
