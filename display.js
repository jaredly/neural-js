
import React from 'react'

const cache = new Map();

export default class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {src: null};
  }

  componentDidMount() {
    this.worker = this.worker = new Worker('./www.js');
    this.draw(1);
  }

  componentDidUpdate() {
    this.draw(1);
  }

  draw() {
    const skipSorted = this.props.skip.toArray().sort()
    let skipText = this.props.layers + ':';
    skipSorted.forEach(k => {
      if (k < this.props.layers) skipText += k + ','
    })
    if (cache[this.props.id]) {
      const src = cache[this.props.id][skipText]
      if (src) {
        this.setState({src: src});
        return
      }
    } else {
      cache[this.props.id] = {};
    }

    const size = 1
    // this.canv = React.findDOMNode(this);
    this.canv = document.createElement('canvas');
    this.canv.width = size * this.props.width;
    this.canv.height = size * this.props.height;
    var ctx = this.canv.getContext('2d');
    var imd = ctx.getImageData(0, 0, size * this.props.width, size * this.props.height);
    var model = this.props.model;
    var layers = this.props.layers
    if (undefined === layers) {
      layers = model.layers
    }
    this.worker.postMessage({
      skip: this.props.skip.toArray() || [],
      layers,
      model,
      imd,
    });

    this.worker.onmessage = e => {
      ctx.putImageData(e.data, 0, 0);
      const src = cache[this.props.id][skipText] = this.canv.toDataURL();
      this.setState({src});
    };
  }

  render() {
    return <img src={this.state.src} />
  }
}

