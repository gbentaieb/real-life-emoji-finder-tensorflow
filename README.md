# Introduction
This project is a simple demo on how you can use tensorflow.js to include machine learning in a web app. I exported the InceptionV3 python model and create the same model for javascript. I can therefore analyze the content of a picture and find emojes in them thanks to that model.

# DEMO
You can find a working demo of this project [here](https://gbentaieb.github.io/real-life-emoji-finder-tensorflow/index.html)

# How does this work
I used the [tensorflow.js library](https://js.tensorflow.org/) to detect objects in an image.

## the model
### Using the model
If you are interrested in the model I used to recognize objects in images, all the assets you need are in `./public/model/`. Then import je model.json thanks to tensorflow:

```javascript
import * as tf from '@tensorflow/tfjs';
tf.loadModel('./model/model.json');
```

### Creating the model
If you are interrested in the way I created the model, you can refer to [the tensorflow documentation](https://js.tensorflow.org/tutorials/import-keras.html) on how to use a python model with tensorflow js.

The model I exported is [this one](https://keras.io/applications/#inceptionv3)
