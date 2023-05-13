import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


import Navigation from './components/Navigation'
import MoviesList from './components/MoviesList'
import MovieReview from './components/MovieReview'
import CreateUser from './components/CreateUser'

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <div className='container p-4'>
        <Routes>
          <Route path='/' Component={MoviesList} />
          <Route path='/review/:id' Component={MovieReview} />
          <Route path='/users' Component={CreateUser} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
