
import React from 'react'
import {Set} from 'immutable'
import localForage from 'localforage'
import assign from 'object-assign'
import state from './state'

import Display from './display'

@state({selected: null})
class Picker extends React.Component {
  render() {
    if (this.props.selected !== null) {
      return <Things id={this.props.selected} />
    }

    return (
      <div style={styles.container}>
        {this.props.keys.map(key => {
          if (!key.endsWith('-shot')) {
            return;
          }
          return <div style={styles.item} key={key} onClick={() => this.props.onChange('selected', key)}>
            <ShotPreview id={key} />
          </div>;
        })}
      </div>
    );
  }
}

@state({model: null, skip: Set()}, props => {
  const key = props.id.split('-')[0]
  return localForage.getItem(key).then(model => ({model}))
})
class Things {
  render() {
    if (!this.props.model) {
      return <div style={styles.things}>Waiting...</div>
    }

    var size = 150

    const layers = [];
    const skip = this.props.skip;

    for (let i=0; i<this.props.model.layers + 1; i++) {
      const isSkipped = skip.contains(i);
      const style = assign({}, styles.Things, isSkipped && {
        borderColor: 'blue',
      }, isSkipped && {width: size, display: 'inline-block'});
      layers.push(
        <div onClick={() => {
          if (isSkipped) {
            this.props.onChange('skip', skip.delete(i));
          } else {
            this.props.onChange('skip', skip.add(i));
          }
        }} style={style}>
        {isSkipped ? <span>Skipped</span> : <Display
            width={size}
            height={size}
            wait={i}
            model={this.props.model}
            id={this.props.id}
            skip={skip}
            layers={i}
            key={i}
          />}
        </div>
      )
    }

    return (
      <div style={styles.things}>
        {layers}
      </div>
    );
  }
}

@state({loading: true})
class ShotPreview {
  componentDidMount() {
    localForage.getItem(this.props.id, (err, data) => {
      this.props.onChange({
        loading: false,
        data,
      });
    });
  }
  render() {
    if (this.props.loading) return <span>loading....</span>;
    return <img src={this.props.data} />;
  }
}

const styles = {
  container: {
    padding: 10,
  },

  Things: {
    border: '2px solid #ccc',
    display: 'inline-block',
  },
  
  item: {
    display: 'inline-block',
  },
};

localForage.keys((err, keys) => {
  if (err) {
    return console.error(err);
  }
  React.render(<Picker keys={keys} />, window.target);
});

