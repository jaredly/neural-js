
onmessage = function (e) {
  var G = new R.Graph(false);
  var skipWhat = {};
  e.data.skip.forEach(function (i) {
    skipWhat[i] = true
  });
  drawModel2(G, e.data.imd, e.data.model, e.data.layers, false, skipWhat);
  postMessage(e.data.imd);
}

function drawModel2(G, imd, model, nUse, skip, skipWhat) {
  for (var x=0; x<imd.width; x++) {
    for (var y=0; y<imd.height; y++) {
      var out = forwardNetwork(G, model, x / imd.width - .5, y / imd.height - .5, nUse, skip, skipWhat);
      var off = y * imd.width * 4 + x * 4;
      imd.data[off] = parseInt(out.w[0] * 255);
      imd.data[off + 1] = parseInt(out.w[1] * 255);
      imd.data[off + 2] = parseInt(out.w[2] * 255);
      imd.data[off + 3] = 255;
    }
  }
}

function forwardNetwork(G, model, x_, y_, nUse, back, skipWhat) {
  // x_, y_ is a normal javascript float, will be converted to a mat object below
  // G is a graph to amend ops to
  var x = new R.Mat(3, 1); // input
  x.set(0, 0, x_);
  x.set(1, 0, y_);
  x.set(2, 0, 1.0); // bias.
  var out;
  out = G.tanh(G.mul(model.w_in, x));
  for (var i = 0; i < nUse; i++) {
    debugger;
    if (skipWhat[i]) {
      continue;
    }
    // var j = back ? nUse - i - 1 : i;
    out = G.tanh(G.mul(model['w_'+i], out));
  }
  out = G.sigmoid(G.mul(model.w_out, out));
  return out;
}

