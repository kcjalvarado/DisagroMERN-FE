import logo from './logo.svg';
import './App.css';
import Login from "./components/login";
import Home from "./components/home";
import Testing from "./components/testing";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {getTest} from './functions/test';


function App() {
  const [data, setData] = useState("Hello world! X1");
  
  useEffect(() => {
    getTest()
      .then((res) => {
      setData(res.message);
    })
    .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/testv" element={<Testing/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
