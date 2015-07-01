
import React from 'react'
import localForage from 'localforage'
import assign from 'object-assign'

import Display from './display'

function initModel(networkSize, nHidden) {
  var model = {
    netSize: networkSize,
    layers: nHidden,
  };
  var randomSize = 1.0;

  // define the model below:
  model.w_in = R.RandMat(networkSize, 3, 0, randomSize); // x, y, and bias
  for (var i = 0; i < nHidden; i++) {
    model['w_'+i] = R.RandMat(networkSize, networkSize, 0, randomSize);
  }
  model.w_out = R.RandMat(3, networkSize, 0, randomSize); // output layer
  return model;
}

class SaveDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stored: false};
  }

  save() {
    var key = Math.random().toString(0x0f).slice(10, 20)
    localForage.setItem(key, this.props.model);
    localForage.setItem(key + '-shot', this.canv.toDataURL());
    this.setState({stored: true});
  }

  render() {
    const style = assign({}, styles.canvas, this.state.stored && {
      borderColor: 'blue',
    });
    return <div style={style} onClick={() => this.goBig()}>
      <Display {...this.props} />
    </div>;
  }
}

const styles = {
  canvas: {
    border: '2px solid #ccc',
  },
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.models = [];
    for (var i=0; i<this.props.ticks; i++) {
      this.models.push(initModel(this.props.networkSize, this.props.nHidden));
    }
  }

  render() {
    return (
      <div style={styles.container}>
        {this.models.map((model, i) =>
          <SaveDisplay
            width={this.props.size}
            height={this.props.size}
            wait={i}
            model={model}
          />)}
      </div>
    );
  }
}

React.render(<App
  ticks={10}
  networkSize={16}
  nHidden={14}
  size={200}
/>, window.target);

