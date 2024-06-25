
/*
Lucas Spartacus Vieira Carvalho 
Shaw and Partners
Implementation of the front-end using React
 */
import React, { useState, useEffect } from 'react';
import CSVUpload from './components/CSVUpload';
import SearchBar from './components/SearchBar';
import Card from './components/Card';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDataLoad = (loadedData) => {
    setData(loadedData);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredData = data.filter(row => 
    Object.values(row).some(value =>
      value.toLowerCase().includes(searchQuery)
    )
  );

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  )
  
  useEffect(() => {
    window
    .matchMedia("(min-width: 768px)")
    .addEventListener('change', e => setMatches( e.matches ));
  }, []);

  return (
    <div className="App">

      <nav className='nav'>
      {matches && (<SearchBar onSearch={handleSearch} />)}
      {!matches && (<div className='smallscree'> <SearchBar onSearch={handleSearch} /> </div>)}
       
        <CSVUpload onDataLoad={handleDataLoad} />

      </nav>
      <div className='Line'></div>
      <div className="cards-container">
        {filteredData.map((row, index) => (
          <Card key={index} data={row} />
        ))}
      </div>
    </div>
  );
};

export default App;
