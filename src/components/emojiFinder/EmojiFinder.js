import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import translate from 'moji-translate';

import imagenetData from './imagenet';

import EmojiDisplayer from '../emojiDisplayer/EmojiDisplayer';

import './EmojiFinder.css';

export default class EmojiFinder extends Component {
  constructor(...args) {
    super(...args);
    this.state = { emoji: null, label: null };

    this.canvasWidth = 400;
    this.canvasHeight = 400;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.ctx = this.canvas.getContext('2d');

    this.startSearching = this.startSearching.bind(this);
    this.loadModel = this.loadModel.bind(this);
    this.search = this.search.bind(this);

    this.loadModel();
  }

  componentDidMount() {
    if (this.props.isVisible && this.props.videoElement) this.startSearching();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible) this.startSearching();
  }

  async loadModel() {
    this.model = await tf.loadModel('./model/model.json');
  }

  async startSearching() {
    if (!this.props.videoElement || !this.model) {
      setTimeout(this.startSearching, 500);
    } else {
      await this.search();
      setTimeout(this.startSearching, 1000);
    }
  }

  async search() {
    tf.tidy(() => {
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      this.ctx.clearRect(0, 0, height, width);
      this.ctx.drawImage(this.props.videoElement, 0, 0, width, height);

      const imageData = this.ctx.getImageData(0, 0, width, height).data;
      const dataTensor = ndarray(new Float32Array(imageData), [width, height, 4])
      const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3]);

      ops.divseq(ops.subseq(dataTensor.pick(null, null, 2), 103.939), 255);
      ops.divseq(ops.subseq(dataTensor.pick(null, null, 1), 116.779), 255);
      ops.divseq(ops.subseq(dataTensor.pick(null, null, 0), 123.68), 255);
      ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 2));
      ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
      ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 0));

      const preprocessedData = tf.tensor4d(dataProcessedTensor.data, [1, width, height, 3], 'float32').as4D(1, width, height, 3);
      const prediction = this.model.predict(preprocessedData);

      const data = prediction.dataSync();

      let bestResult = null;
      let bestProb = 0;
      data.forEach((elt, index) => {
        if (bestProb < elt) {
          bestProb = elt;
          const result = imagenetData[index][1].split('_');
          bestResult = result[result.length - 1];
        }
      });

      this.setState((prevState) => ({
        ...prevState,
        label: bestResult,
        emoji: translate.translate(bestResult, true),
      }));
    });
  }

  render() {
    return (
      <div>
        { this.props.isVisible &&
          <div className='resultContainer'>
            <EmojiDisplayer emoji={this.state.emoji}/>
          </div>
        }
      </div>
    )
  }
}