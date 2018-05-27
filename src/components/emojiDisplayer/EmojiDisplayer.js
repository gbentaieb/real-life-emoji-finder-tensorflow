import React, { Component } from 'react';
import './EmojiDisplayer.css';

export default class EmojiDisplayer extends Component {
  componentDidMount() {
    this.emojiContainer.style.animation = 'spin 1s linear infinite';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.emoji) {
      this.emojiContainer.style.animation = null;
      this.emojiContainer.style.width = '75px';
      this.emojiContainer.style.height = '75px';
      this.emojiContainer.style.marginBottom = '30px';
      this.emojiContainer.style.borderTop = '5px solid transparent';
    } else {
      this.emojiContainer.style.animation = 'spin 1s linear infinite';
      this.emojiContainer.style.width = '50px';
      this.emojiContainer.style.height = '50px';
      this.emojiContainer.style.marginBottom = '0px';
      this.emojiContainer.style.borderTop = '5px solid rgb(13, 177, 18)';
    }
  }

  render() {
    return (
      <div className='EmojiContainer' ref={e => this.emojiContainer = e}>
        {this.props.emoji && <p>{this.props.emoji}</p>}
      </div>
    )
  }
}