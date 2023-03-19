import { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar.jsx';
import Art from './components/art.jsx';
import Footer from './components/footer.jsx';

function App() {

  return (
    <div className="App">
      <Navbar />

      <div className='main'>
        <Art />
      </div>
      <Footer />
    </div>
  )
}

export default App;
