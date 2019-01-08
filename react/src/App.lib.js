import React, { Component } from 'react';
import Button from 'src/components/Button';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          <Button margin="1em">Touch Me</Button>
        </header>
      </div>
    );
  }
}

export default App;
