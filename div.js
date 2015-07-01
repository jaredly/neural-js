
import React from 'react'
import assign from 'object-assign'

export default class Div {
  render() {
    var {style, ...props} = this.props;
    style = assign({
      display: 'flex',
      flexDirection: 'column',
    }, style);
    return <div {...this.props} />;
  }
}
