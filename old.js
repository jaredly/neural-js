// actual size of generated image
var sizeh = 320;
var sizew = 320;

// settings of nnet:
var networkSize = 16; // 16 neurons in each layer
var nHidden = 8; // depth of 8 layers
var nOut = 3; // r, g, b layers

// support variables:
var img; // this is where we hold the image
var G = new R.Graph(false); // graph object from recurrent.js

var initModel = function() {
  var model = [];
  // define the model below:
  model.w_in = R.RandMat(networkSize, 3); // x, y, and bias
  for (var i = 0; i < nHidden; i++) {
    model['w_'+i] = R.RandMat(networkSize, networkSize);
  }
  model.w_out = R.RandMat(nOut, networkSize); // output layer
  return model;
};

var model = initModel();

var forwardNetwork = function(G, model, x_, y_) {
  var x = new R.Mat(3, 1); // input
  var i;
  x.set(0, 0, x_);
  x.set(1, 0, y_);
  x.set(2, 0, 1.0); // bias.
  var out;
  out = G.tanh(G.mul(model.w_in, x));
  for (i = 0; i < nHidden; i++) {
    out = G.tanh(G.mul(model['w_'+i], out));
  }
  out = G.sigmoid(G.mul(model.w_out, out));
  return out;
};

function getColorAt(x, y) {
  // function that returns a color given coord (x, y)
  var r, g, b;
  var out = forwardNetwork(G, model, x, y);

  r = out.w[0]*255.0;
  g = out.w[1]*255.0;
  b = out.w[2]*255.0;

  return color(r, g, b);
}

function color(r, g, b) {
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

var c = window.out;
var ctx = c.getContext('2d');

for (var x=0; x<100; x++) {
  for (var y=0; y<100; y++) {
    ctx.fillStyle = getColorAt(x / sizew - 0.5, y / sizeh - 0.5);
    ctx.fillRect(x, y, 1, 1);
  }
}

// ... rest of the code populates img using getColorAt(x, y)
