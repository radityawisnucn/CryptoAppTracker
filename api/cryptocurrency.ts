// api/cryptocurrency.ts
import client from "./client";

interface FetchCryptocurrencyListResponse {
  data: CryptoData[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
    total_count: number;
  };
}

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

export interface CryptoInfo {
  id: number;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  slug: string;
  urls: {
    website: string[];
    technical_doc: string[];
    twitter: string[];
    reddit: string[];
    message_board: string[];
    announcement: string[];
    chat: string[];
    explorer: string[];
    source_code: string[];
  };
  date_added: string;
  tags: string[];
  category: string;
  date_launched: string;
}

export interface FetchCryptocurrencyDetailsResponse {
  [key: number]: CryptoInfo;
}

/**
 * Mengambil daftar cryptocurrency terbaru dengan paginasi.
 * @param start Posisi awal untuk mengambil data.
 * @param limit Jumlah cryptocurrency yang diambil.
 */
export const fetchCryptocurrencyList = async (
  start: number,
  limit: number
): Promise<FetchCryptocurrencyListResponse> => {
  try {
    const response = await client.get("/cryptocurrency/listings/latest", {
      params: {
        start,
        limit,
        convert: "USD",
      },
    });
    return {
      data: response.data.data,
      status: response.data.status,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mengambil detail cryptocurrency, termasuk nama, simbol, deskripsi, dan logo, berdasarkan array ID.
 * @param ids Array ID cryptocurrency.
 */
export const fetchCryptocurrencyDetails = async (
  ids: number[]
): Promise<FetchCryptocurrencyDetailsResponse> => {
  try {
    const response = await client.get("/cryptocurrency/info", {
      params: {
        id: ids.join(","),
      },
    });
    return response.data.data; // Mengembalikan objek dengan ID sebagai kunci
  } catch (error) {
    throw error;
  }
};
