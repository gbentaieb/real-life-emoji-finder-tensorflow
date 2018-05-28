import React, { Component } from 'react';

import OpenCameraButton from './components/openCameraButton/OpenCameraButton';
import VideoBackground from './components/videoBackground/VideoBackground';
import EmojiFinder from './components/emojiFinder/EmojiFinder';

import './App.css';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.requireMediaAccess = this.requireMediaAccess.bind(this);
    this.state = { cameraOpened: false };
  }

  async requireMediaAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
      this.videoBackground.videoElement.srcObject = stream;
      this.setState((prevState) => ({ ...prevState, cameraOpened: true }))
    } catch (e) {
      console.log('could not access webcam', e);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Real Life Emoji Finder</h1>
        </header>
        <VideoBackground ref={e => this.videoBackground = e}/>
        <div className='mainContainer'>
          { !this.state.cameraOpened &&
            <OpenCameraButton onClick={this.requireMediaAccess} />
          }
          <EmojiFinder videoElement={this.videoBackground && this.videoBackground.videoElement} isVisible={this.state.cameraOpened}/>
        </div>
      </div>
    );
  }
}

export default App;
