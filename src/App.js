import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>电力电网数据地图展示系统</h1>
      </header>
      <main className="App-main">
        <MapComponent />
      </main>
    </div>
  );
}

export default App; 