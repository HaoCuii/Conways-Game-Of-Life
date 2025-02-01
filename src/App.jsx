import React from 'react';
import Conway from '/components/Conway.jsx';
import patterns from '/patterns.js';

const App = () => {
  const categories = {
    'Still Lifes': [],
    'Oscillators': [],
    'Spaceships': []
  };

  Object.keys(patterns).forEach((pattern) => {
    categories[patterns[pattern].type].push(pattern);
  });

  const setPattern = (pattern) => {
    const event = new CustomEvent('setPattern', { detail: pattern });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-gray-300">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Conway's Game of Life</h1>
          <p className="text-xl text-gray-600">A cellular automaton created by mathematician John Conway.</p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">What is Conway's Game of Life?</h2>
          <p className="text-lg text-gray-700">
            The Game of Life, also known as Conway's Game of Life or simply Life, is a cellular automaton 
            devised by the British mathematician John Horton Conway in 1970. It is a zero-player game,
            meaning that its evolution is determined by its initial state, requiring no further input. One interacts 
            with the Game of Life by creating an initial configuration and observing how it evolves. 
            It is Turing complete and can simulate a universal constructor or any other Turing machine.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">How Does it Work?</h2>
          <p className="text-lg text-gray-700">
            The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is 
            in one of two possible states, live or dead or populated and unpopulated, respectively. Every cell interacts with its eight neighbours, which are 
            the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
            <li><strong>Any live cell with fewer than two live neighbors dies.</strong> (Underpopulation)</li>
            <li><strong>Any live cell with two or three live neighbors lives on to the next generation.</strong></li>
            <li><strong>Any live cell with more than three live neighbors dies.</strong> (Overpopulation)</li>
            <li><strong>Any dead cell with exactly three live neighbors becomes a live cell.</strong> (Reproduction)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">
            Create your own seeds or see what happens with our preset patterns!
          </h3>
          
          <div className="flex gap-8 justify-center items-start">
            <div className="flex-1">
              <Conway setPattern={setPattern} />
            </div>
            
            <div className="w-80 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-2xl font-semibold text-gray-800 mb-6">
                Pattern Library
              </h4>
              <div className="space-y-6">
                {Object.keys(categories).map((category) => (
                  <div key={category} className="space-y-3">
                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {category}
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {categories[category].map((pattern) => (
                        <button
                          key={pattern}
                          onClick={() => setPattern(patterns[pattern].pattern)}
                          className="w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {pattern}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="text-center space-y-4">
          <p className="text-lg text-gray-700">
            Explore the world of Conway's Game of Life and observe fascinating patterns emerge!
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Learn More on Wikipedia
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;