import React, { Component } from 'react';
import './LabelDisplayer.css';

export default class LabelDisplayer extends Component {
  render() {
    return (
      <div>
        <p>{this.props.label}</p>
      </div>
    )
  }
}