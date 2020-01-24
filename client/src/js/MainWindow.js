import React, { useState } from 'react';
import PropTypes from 'proptypes';

function getDevices() {
  const selectBox = document.querySelector('select#selectBox');
  navigator.mediaDevices.enumerateDevices().
      then(deviceInfos => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i];
          // const obj = {};
          console.log('deviceInfo.kind', deviceInfo.kind)
          const obj = document.createElement('option');
          // obj.value = deviceInfo.deviceId;
          // if (deviceInfo.kind === 'audioinput') {
          //   obj.text = deviceInfo.label ||
          //     'microphone ' //+ (audioSelect.length + 1);
          //   selectBox.appendChild(obj);
          // } else 
          if (deviceInfo.kind === 'videoinput') {
            obj.text = deviceInfo.label || 'camera ' //+ (videoSelect.length + 1);
            obj.value = deviceInfo.deviceId;
            selectBox.appendChild(obj);
          } else {
            // console.log('Found another kind of device: ', deviceInfo);
          }
        }
      })
}

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);
  const [deviceID, setDeviceID] = useState(null);
  const devices = getDevices();
  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video, deviceID };
    console.log(';call', config)
    return () => friendID && startCall(true, friendID, config);
  };
  console.log('dasda', deviceID)
  return (
    <div className="container main-window">
      <div>
        <h3>
          Hi, your ID is
          <input
            type="text"
            className="txt-clientId"
            defaultValue={clientId}
            readOnly
          />
        </h3>
        <h4>Get started by calling a friend below</h4>
      </div>
      <div>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Your friend ID"
          onChange={event => setFriendID(event.target.value)}
        />
        <div>
          <select 
            style={{ color: 'blue' }}
            id="selectBox" 
            onChange={event => {
                setDeviceID(event.target.value)
                localStorage.setItem('deviceId', event.target.value);
              }}
            > 
          </select>
          <button
            type="button"
            className="btn-action fa fa-video-camera"
            onClick={callWithVideo(true)}
          />
          <button
            type="button"
            className="btn-action fa fa-phone"
            onClick={callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
