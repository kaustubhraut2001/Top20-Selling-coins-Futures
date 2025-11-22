"use client";

import { useState, useEffect } from "react";

const BINANCE_API_BASE = "https://fapi.binance.com/fapi/v1/premiumIndex";
// const COINDCX_API_BASE = "https://api.coindcx.com/exchange/ticker"
// https://api.coindcx.com/exchange/ticker

interface CoinData {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  volume: number;
  sellVolume: number;
  sellVolumePercent: number;
}

// async function fetch24hrData(): Promise<CoinData[]> {
// //   const response = await fetch(${BINANCE_API_BASE}/ticker/24hr)
//   const response = await fetch(${BINANCE_API_BASE})
//   const data = await response.json()
//   return data
//     .filter((coin: any) => coin.market.endsWith("USDT"))
//     .map((coin: any) => ({
//       symbol: coin.market,
//       lastPrice: Number.parseFloat(coin.last_price),
//       priceChangePercent: Number.parseFloat(coin.change_24_hour),
//       volume: Number.parseFloat(coin.volume),
//       sellVolume: (Number.parseFloat(coin.volume) * (1 - Number.parseFloat(coin.change_24_hour) / 100)) / 2,
//       sellVolumePercent: ((1 - Number.parseFloat(coin.change_24_hour) / 100) / 2) * 100,
//     }))
//     .filter(
//       (coin: CoinData) => coin.priceChangePercent < 0 && coin.sellVolumePercent > 55, // Assuming more than 55% of volume is sell volume
//     )
//     .sort((a: CoinData, b: CoinData) => b.sellVolumePercent - a.sellVolumePercent)
// }

async function fetch24hrData(): Promise<CoinData[]> {
  const response = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr");
  // const response = await fetch(BINANCE_API_BASE)
  const data = await response.json();

  return data
    .filter((coin: any) => coin.symbol.endsWith("USDT"))
    .map((coin: any) => {
      const volume = parseFloat(coin.quoteVolume);
      const priceChangePercent = parseFloat(coin.priceChangePercent);
      const sellVolume = (volume * (1 - priceChangePercent / 100)) / 2;

      return {
        symbol: coin.symbol,
        lastPrice: parseFloat(coin.lastPrice),
        priceChangePercent,
        volume,
        sellVolume,
        sellVolumePercent: ((1 - priceChangePercent / 100) / 2) * 100,
      };
    })
    .filter(
      (coin: CoinData) =>
        coin.priceChangePercent < 0 && coin.sellVolumePercent > 55
    )
    .sort(
      (a: CoinData, b: CoinData) => b.sellVolumePercent - a.sellVolumePercent
    );
}

export function useCryptoScanner() {
  const [coins, setCoins] = useState<CoinData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch24hrData();
      setCoins(data.slice(0, 30)); // Get top 20 coins
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return coins;
}
