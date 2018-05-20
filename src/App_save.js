import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import imagenetData from './imagenet';
import translate from 'moji-translate';

const width = 200;
const height = 200;

class App extends Component {
  constructor(...args) {
    super(...args);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.decryptUrl = this.decryptUrl.bind(this);

    this.loadingModel = tf.loadModel('./model/model.json').then((model) => {
      this.model = model;
      if (this.ctx) {
        this.onImageLoad(this.ctx);
      }
    })
  }

  async decryptUrl() {
    console.log('decrypt');
    const input = document.getElementById('input');
    const canvas = document.getElementById('canvas');

    const url = input.value;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, height, width);

    const img = new Image;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;

    img.onload = () => {
      ctx.drawImage(img,0,0); // Or at whatever offset you like

      if (this.model) {
        this.onImageLoad(ctx);
      } else {
        this.ctx = ctx;
      }
    };

    img.src = url;
  }

  async onImageLoad(context) {
    console.log('onImageLoad');
    const imageData = context.getImageData(0, 0, width, height).data;

    const dataTensor = ndarray(new Float32Array(imageData), [width, height, 4])
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3]);
    ops.divseq(ops.subseq(dataTensor.pick(null, null, 2), 103.939), 255);
    ops.divseq(ops.subseq(dataTensor.pick(null, null, 1), 116.779), 255);
    ops.divseq(ops.subseq(dataTensor.pick(null, null, 0), 123.68), 255);
    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 2));
    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 0));

    const preprocessedData = tf.tensor4d(dataProcessedTensor.data, [1, width, height, 3], 'float32').as4D(1, width, height, 3);
    const prediction = this.model.predict(preprocessedData, { verbose: true });

    const data = await prediction.data();
    const results = [];

    let bestResult = [null, 0];
    data.forEach((elt, index) => {
      if (bestResult[1] < elt) bestResult = [imagenetData[index][1], elt];

      if (elt > 0.1) {
        results.push(imagenetData[index][1]);
        console.log(imagenetData[index][1], elt)
      }
    })
    document.getElementById('resultOutput').innerHTML = translate.translate(bestResult[0].replace('_', ' '), false);

    preprocessedData.dispose();
    prediction.dispose();
    console.log('done', bestResult);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Image detection</h1>
        </header>
        <div>
          <input type="text" id="input" name="imageUrl" />
          <button onClick={this.decryptUrl}>Submit</button>
          <div>
            <canvas id='canvas' width={width} height={height}/>
          </div>
        </div>
        <p id='resultOutput' style={{fontSize: '40px'}}></p>
      </div>
    );
  }
}

export default App;
