import React, { Component } from 'react';
import './OpenCameraButton.css';

export default class OpenCameraButton extends Component {
  render() {
    return (
      <button className='openCameraBtn' onClick={this.props.onClick}>
        Open Camera
      </button>
    )
  }
}