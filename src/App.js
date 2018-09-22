import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';

const numSocket = new Rete.Socket('Number value');

class NumComponent extends Rete.Component {
  constructor(){
      super('Number');
  }

  builder(node) {
      let out = new Rete.Output('Number',numSocket); 

      node.addOutput(out);
  }

  worker(node, inputs, outputs){
      outputs[0] = node.data.num;
  }
}

const container = document.querySelector('#rete');
const editor = new Rete.NodeEditor('demo@0.1.0', container);

editor.use(ConnectionPlugin)
editor.use(VueRenderPlugin)

const numComponent = new NumComponent();
editor.register(numComponent);

const engine = new Rete.Engine('demo@0.1.0');
editor.register(numComponent);

editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
    await engine.abort();            
    await engine.process(editor.toJSON());            
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div id="rete" class="node-editor"></div>
      </div>
    );
  }
}

export default App;
