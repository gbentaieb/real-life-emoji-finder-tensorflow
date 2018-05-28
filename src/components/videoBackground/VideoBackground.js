import React, { Component } from 'react';

import './VideoBackground.css';

export default class VideoBackground extends Component {
  render() {
    return (
      <div className='videoElementContainer'>
        <div className='videoElementWrapper'>
          <video autoPlay muted playsInline className='videoElement' ref={(elt => this.videoElement = elt)}/>
        </div>
      </div>
    )
  }
}