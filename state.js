
import React from 'react'

export default (initial, onMounted) => Component => class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = initial;
  }

  componentDidMount() {
    if (onMounted) {
      onMounted(this.props).then(vals => this.setState(vals));
    }
  }

  onChange = (name, val) => {
    if ('object' === typeof name && !val) {
      this.setState(name);
    } else {
      this.setState({[name]: val});
    }
  };

  render() {
    return <Component {...this.props} {...this.state} onChange={this.onChange} />;
  }
};

