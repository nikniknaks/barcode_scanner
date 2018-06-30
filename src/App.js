import React, { Component } from 'react';
import Quagga  from 'quagga';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super()

    this.state = {
      codes: [],
      scannerActive: false,
      canvas: {},
      context: {},
      video: {},
      imageUrls: [],
    }

    this.onDetected = this.onDetected.bind(this)
    this.startScanning = this.startScanning.bind(this)
    this.stopScanning = this.stopScanning.bind(this)
    this.captureImage = this.captureImage.bind(this)
  }

  quaggaInitCallback(err) {

      if (err) {
          console.log(err);
          return
      }

      console.log("Initialization finished. Ready to start");

      this.onDetected();

      Quagga.start()

      this.setState({
        canvas: document.querySelector('.input-stream canvas'),
      })

      this.setState({
        context: this.state.canvas.getContext('2d'),
        video: document.querySelector('.input-stream video'),
      })
  }

  displayDuplicateAlert() {
    window.alert('You have already scanned this barcode.')
  }

  onDetected() {
    Quagga.onDetected(v => {
      this.captureImage()
      this.stopScanning()
      this.state.codes.includes(v.codeResult.code)
        ? this.displayDuplicateAlert()
        : (() => {
          this.addDetectedCode(v.codeResult.code)
        })()
    })
  }

  captureImage() {
    this.state.context.drawImage(this.state.video, 0, 0, this.state.canvas.width, this.state.canvas.height)
    this.state.canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      console.log('url: ', url)
      this.setState({
        imageUrls: [...this.state.imageUrls, url]
      })
    })
  }

  addDetectedCode(code) {
    this.setState({
      codes: [...this.state.codes, code]
    })
  }

  stopScanning() {
    Quagga.stop()
  }

  startScanning () {

    this.setState({
        scannerActive: true
    })

    Quagga.init({
      inputStream : {
        name : "Barcode Scanner",
        type : "LiveStream",
        target: document.querySelector('.input-stream')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_128_reader"],
        multiple : false,
      },
      locate : true,
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true,
        showCanvas: true,
        showPatches: true,
        showFoundPatches: true,
        showSkeleton: true,
        showLabels: true,
        showPatchLabels: true,
        showRemainingPatchLabels: true,
        boxFromPatches: {
          showTransformed: true,
          showTransformedBox: true,
          showBB: true
        }
      }
    },
    this.quaggaInitCallback.bind(this));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> Barcode Scanner</h1>
        </header>
        <ul className="codes">
        {this.state.codes.map((v, i) => {
          return (<li key={i}>{v}</li>)
        })}
        </ul>
        <button onClick={this.startScanning}>Scan</button>
        <div className="input-stream"></div>
        <button onClick={this.stopScanning}>Cancel</button>
        <div>Barcode Images</div>
        <ul className="barcodeImages">
          {
            this.state.imageUrls.map((v, i) => {
              return (<li key={i}><img src={v}/></li>)
            })
          }
        </ul>
      </div>
    );
  }
}

export default App
