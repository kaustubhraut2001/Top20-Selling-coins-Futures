"use client"

import { useCryptoScanner } from "../utils/cryptoScanner"

export default function CryptoScanner() {
  const coins = useCryptoScanner();

  const openTradingViewChart = (symbol: string) => {
    const binanceSymbol = symbol.replace("USDT", "USDT");
    const tradingViewUrlBinance = `https://www.tradingview.com/chart/?symbol=BINANCE:${binanceSymbol}`;
    const tradingViewUrlFallback = `https://www.tradingview.com/chart/?symbol=POLONIEX:${binanceSymbol}`; // Fallback URL for Poloniex


    const binanceWindow = window.open(tradingViewUrlBinance, "_blank");


    setTimeout(() => {
      if (!binanceWindow || binanceWindow.closed) {
        window.open(tradingViewUrlFallback, "_blank");
      }
    }, 2000);
  };


  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mt-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Top 30 Coins with Continuous Selling (24-hour)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">


          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Volume (USDT)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sell Volume %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Chart</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {coins.map((coin, index) => (
              <tr key={coin.symbol} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{coin.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${coin.lastPrice.toFixed(4)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${coin.priceChangePercent < 0 ? "text-red-600" : "text-green-600"}`}>
                  {coin.priceChangePercent.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{coin.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{coin.sellVolumePercent.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => openTradingViewChart(coin.symbol)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Open Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}
