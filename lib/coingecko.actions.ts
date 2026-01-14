"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL!;
const API_KEY = process.env.COINGECKO_API_KEY!;

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
      query: params,
    },
    { skipNull: true, skipEmptyString: true }
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-pro-api-key": API_KEY,
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CoinGecko ${response.status}: ${text}`);
  }

  return response.json();
}
