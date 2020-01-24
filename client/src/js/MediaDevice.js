import _ from 'lodash';
import Emitter from './Emitter';

// const DEVICE =  'USB Camera (046d:0825)';

/**
 * Manage all media devices
 */
class MediaDevice extends Emitter {
  /**
   * Start media devices and send stream
   */
  start() {
    let constraints = {
      video: {
        facingMode: 'user',
        height: { min: 360, ideal: 720, max: 1080 },
        deviceId: localStorage.getItem('deviceId')
      },
      audio: true
    };

    // navigator.mediaDevices.enumerateDevices()
    //   .then(dd=> { 
    //     dd.map(device => {
    //       if (device.kind == 'videoinput' && device.label == DEVICE) {
    //         constraints.video.deviceId = device.deviceId;
    //       }
    //     })
    //   }) 

    // navigator.usb.requestDevice({filters:[]})
    //   .then(selectedDevice => {
    //      device = selectedDevice;
    //      console.log('selectedDevice', device, selectedDevice);
    //      return device.open(); // Begin a session.
    //    })
    //   .then(() => {
    //     console.log('daada', device.selectConfiguration);
    //     device.selectConfiguration(1)}) // Select configuration #1 for the device.
    //   .then(() => {
    //     console.log('daada', device.claimInterface);
    //     device.claimInterface(0)}) // Request exclusive control over interface #2.
    //   .then(() => {
    //     console.log('daada', device.controlTransferOut);
    //       device.controlTransferOut({
    //       requestType: 'class',
    //       recipient: 'interface',
    //       request: 0x22,
    //       value: 0x01,
    //       index: 0x02})}) // Ready to receive data
    //   .then(() => {
    //     console.log('dedde', device);
    //     device.transferIn(5, 64)
    //   }) // Waiting for 64 bytes of data from endpoint #5.
    //   .then(result => {
    //     let decoder = new TextDecoder();
    //     console.log('decoder', decoder, result);
    //     console.log('Received: ' + decoder.decode(result.data));
    //   })
    //   .catch(error => { console.log('this.error', error); });
    console.log('constraints', constraints)

    setTimeout(() => {
      // constraints.video.deviceId = localStorage.getItem('deviceId');
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.stream = stream;
          this.emit('stream', stream);
        })
        .catch((err) => {
          if (err instanceof DOMException) {
            alert('Cannot open webcam and/or microphone');
          } else {
            console.log(err);
          }
        });
    }, 3000)

    return this;
  }

  /**
   * Turn on/off a device
   * @param {String} type - Type of the device
   * @param {Boolean} [on] - State of the device
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, 'enabled', state);
      });
    }
    return this;
  }

  /**
   * Stop all media track of devices
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    return this;
  }
}

export default MediaDevice;
