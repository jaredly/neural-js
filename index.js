
import React from 'react'

class Display extends React.Component {
  componentDidMount() {
    // this.canv = document.createElement('canvas');
    var G = new R.Graph(false);
    this.canv = React.findDOMNode(this);
    this.canv.width = this.props.width;
    this.canv.height = this.props.height;
    var ctx = this.canv.getContext('2d');
    var imd = ctx.getImageData(0, 0, this.props.width, this.props.height);
    var model = this.props.model;
    drawModel2(G, imd, model, model.layers, 0, 0, false);
    ctx.putImageData(imd, 0, 0);
    // React.findDOMNode(this).src = this.canv.toDataURL();
  }

  render() {
    return <canvas />;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.model = initModel(this.props.networkSize, this.props.nHidden);
  }

  render() {
    return (
      <div style={styles.container}>
        <Display
          width={this.props.size}
          height={this.props.size}
          model={this.model}
        />
      </div>
    );
  }
}

const styles = {
};

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
};

function drawModel2(G, imd, model, nUse, skip) {
  for (var x=0; x<imd.width; x++) {
    for (var y=0; y<imd.height; y++) {
      var out = forwardNetwork(G, model, x / imd.width - .5, y / imd.height - .5, nUse, skip);
      var off = y * imd.width * 4 + x * 4;
      imd.data[off] = parseInt(out.w[0] * 255);
      imd.data[off + 1] = parseInt(out.w[1] * 255);
      imd.data[off + 2] = parseInt(out.w[2] * 255);
      imd.data[off + 3] = 255;
    }
  }
}

var forwardNetwork = function(G, model, x_, y_, nUse, back) {
  // x_, y_ is a normal javascript float, will be converted to a mat object below
  // G is a graph to amend ops to
  var x = new R.Mat(3, 1); // input
  var i;
  x.set(0, 0, x_);
  x.set(1, 0, y_);
  x.set(2, 0, 1.0); // bias.
  var out;
  out = G.tanh(G.mul(model.w_in, x));
  for (i = 0; i < nUse; i++) {
    var j = back ? nUse - i - 1 : i;
    out = G.tanh(G.mul(model['w_'+j], out));
  }
  out = G.sigmoid(G.mul(model.w_out, out));
  return out;
};

/*
function norm(ar, v, n) {
  for (var i=0; i<ar.length; i++) {
    ar[i] = v * (i % n) / n //(i / ar.length);
  }
}
*/

/*
function getColorAt(model, x, y, nUse, skip) {
  // function that returns a color given coordintes (x, y)
  // (x, y) are scaled to -0.5 -> 0.5 for image recognition later
  // but it can be behond the +/- 0.5 for generation above and beyond
  // recognition limits
  var r, g, b;
  var out = forwardNetwork(G, model, x, y, nUse, skip);

  r = out.w[0]*255.0;
  g = out.w[1]*255.0;
  b = out.w[2]*255.0;

  return color(r, g, b);
}

function color(r, g, b) {
  return 'hsl(' + parseInt(r / 255 * 360) + ',' + parseInt(g/2.55) + '%,' + parseInt(b/2.55) + '%)';
}

function color2(r, g, b) {
  return 'rgb(' + parseInt(r) + ',' + parseInt(g) + ',' + parseInt(b) + ')';
}
*/

/*
function drawModel(model, nUse, x0, y0, skip) {
  var c = window.out;
  var ctx = c.getContext('2d');

  for (var x=0; x<sizew; x++) {
    for (var y=0; y<sizeh; y++) {
      ctx.fillStyle = getColorAt(model, x / sizew - 0.5, y / sizeh - 0.5, nUse, skip);
      ctx.fillRect(x0 + x, y0 + y, 1, 1);
    }
  }
}

function red(v) {
  return 'hsl(0,100%,' + (v * 50) + '%)';
}

function drawLine(line, x, y, ctx, w, h) {
  for (var i=0; i<line.length; i++) {
    ctx.fillStyle = line[i] > 0 ? red(line[i]) : blue(-line[i])
    ctx.fillRect(x + i*w, y, w, h);
  }
}

function drawMat(ctx, mat, x, y, sz) {
  for (var i=0; i<mat.w.length; i++) {
    ctx.fillStyle = red(mat.w[i] + 1)
    ctx.fillRect(x + parseInt(i / mat.n) * sz, y + sz * (i % mat.n), sz, sz);
  }
}

function debug() {
  var ctx = window.val.getContext('2d');
  // drawMat(ctx, model.w_in, 0, 0, 6);
  for (var i=0; i<nHidden; i++) {
    drawMat(ctx, model['w_' + i], i * (sizew + 3), 0, sizew / networkSize);
  }
}

function ticks(n, fn, at) {
  at = at || 0;
  fn(at);
  if (at < n) requestAnimationFrame(function(){ticks(n, fn, at + 1)});
}
*/

/*
ticks(8, function (i) {
  var model = initModel();
  drawModel(model, nHidden, i * (sizew + 3), 0);
});
/*
ticks(32, function (i) {
  var model = initModel();
  drawModel(model, nHidden, i * (sizew + 3), sizeh + 3);
});
ticks(32, function (i) {
  var model = initModel();
  drawModel(model, nHidden, i * (sizew + 3), 2 * sizeh + 6);
});
// */

/*
window.out.width = nHidden * (sizew + 3);
model = initModel();
ticks(nHidden, function (i) {
  drawModel(model, i, i * (sizew + 3), 0);
});
// */

/*
ticks(nHidden, function (i) {
  drawModel(model, nHidden - i, (i + 1) * (sizew + 3), sizeh + 10, true);
});
*/
// debug();

React.render(<App
  networkSize={16}
  nHidden={12}
  size={300} />, window.target);
