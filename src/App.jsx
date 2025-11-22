import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState();
  const [cryptoData, setCryptoData] = useState([]);
  const [sortedData, setSortedData] = useState([]);


  useEffect(() => {
    const crypto = async () => {
      let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
      let data = await response.json();
      setCryptoData(data);
      setSortedData(data);
    }

    crypto();
  }, [])

  function fetchWithThen() {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
      .then(res => res.json())
      .then(data => {
        setCryptoData(data);
        setSortedData(data);
      })
      .catch(err => console.error(err));
  }

  function getFilteredData() {
    if (!input) return sortedData;

    return sortedData.filter(coin =>
      coin.name.toLowerCase().includes(input.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(input.toLowerCase())
    );
  }

  function sortByMarketCap() {
    const sorted = [...sortedData].sort((a, b) => b.market_cap - a.market_cap);
    setSortedData(sorted);
  }

  function sortByPercentage() {
    const sorted = [...sortedData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    setSortedData(sorted);
  }

  return (
    <>
      <div className="container">
        <div className='searchAndButton'>
          <div className="searchBox">
            <input
              type='text'
              name="search"
              id="search"
              placeholder='Search By Name or Symbol'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button onClick={sortByMarketCap}>Sort by Market Cap</button>
          <button onClick={sortByPercentage}>Sort by percentage</button>
        </div>
        <div className="cryptoTable">
          <table>
            <tbody>
              {getFilteredData().map(coin => (
                <tr key={coin.id}>
                  <td>
                    <div className="coinName">
                      <img src={coin.image} alt={coin.name} width="25" />
                      {coin.name}
                    </div>
                  </td>

                  <td className="symbol">
                    {coin.symbol.toUpperCase()}
                  </td>

                  <td className="price">
                    ${coin.current_price.toLocaleString()}
                  </td>

                  <td className="marketCap">
                    {coin.total_volume.toLocaleString()}
                  </td>

                  <td className={coin.price_change_percentage_24h >= 0 ? "percentGreen" : "percentRed"}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>

                  <td className="marketLabel">
                    Mkt Cap: ${coin.market_cap.toLocaleString()}
                  </td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
