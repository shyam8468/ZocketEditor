


// // src/App.js
import React from 'react';
import CanvasEditor from './Components/CanvasEditor';
import 'tailwindcss/tailwind.css';

function App() {
  return (
    <div className="App">
      <header className="App-header p-4">
        {/* <h1 className="text-3xl font-bold mb-4">Canvas Editor</h1> */}
        <h1 className="text-3xl font-bold mb-4 text-center mx-auto">Canvas Editor</h1>

        <CanvasEditor />
      </header>
    </div>
  );
}

export default App;


