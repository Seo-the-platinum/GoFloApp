import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  View,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity } from 'react-native'
import { Audio } from 'expo-av'
import { AntDesign, Entypo } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'

class Record extends Component {
  state={
    currentMillis: null,
    durationMillis: null,
    isDoneRecording: false,
    isLoading: false,
    isRecording: null,
    playingStatus: 'nosound',
    recordingStatus:'notrecording',
    timer: null,
    uri: null,
  }

  async componentDidMount() {
    const { status }= await Audio.requestPermissionsAsync()
    if ( status !== 'granted') {
      alert ('Sorry, we need microphone permissions to make this work')
    }
  }

  _playAndPause= ()=> {
    switch (this.state.playingStatus) {
      case 'nosound':
        this._playRecording()
        break;
      case 'playing':
        this._pauseRecording()
        break;
      case 'donepause':
        this._resumeRecording()
        break;
      default:
        return;
    }
  }

 _pauseRecording= async ()=> {
  await this.sound.pauseAsync()
  this.setState(currState => ({
    ...currState,
    playingStatus: 'donepause',
  }))
 }

 _playRecording= async ()=> {
   const source= {uri: this.state.uri}
   const { sound }= await Audio.Sound.createAsync(
     source,
   {
     shouldPlay: true,
     isLooping: false,
   },
   this._updateScreenForSoundStatus,
   )
   this.sound= sound
   this.setState(currState=> ({
     ...currState,
     playingStatus: 'playing'
   }))
 }

  _updateScreenForSoundStatus= (status)=> {
    console.log('volume status here!', status.volume)
    this.setState(currState=> ({
      ...currState,
      currentMillis: status.positionMillis,
      durationMillis: status.durationMillis,
    }))

    /*if audio.sound.status.isPlaying is true and playingStatus
    does not equal playing, the setstate to playing */
    if (status.isPlaying && this.state.playingStatus !== "playing") {
      this.setState({ playingStatus: "playing" });
      /* if isPlaying is not true and playingstatus is playingStatus
      change state to donepause*/
    } else if (!status.isPlaying && this.state.playingStatus === "playing") {
      this.setState({ playingStatus: "donepause" });
    }
  }

  _resumeRecording= async ()=> {
    await this.sound.playAsync()
    this.setState(currState=> ({
      ...currState,
      playingStatus: 'playing',
    }))
  }

  _startRecording= async ()=> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    })

    const recording= new Audio.Recording()
    recording.setOnRecordingStatusUpdate(this._updateMillis())
    recording.setProgressUpdateInterval(1000)

    const recordingSettings = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
    try {
      await recording.prepareToRecordAsync(recordingSettings)
      await recording.startAsync()

    }
    catch (error){
      console.log(error)
    }

    this.setState(currState=> ({
      ...currState,
      recordingStatus: 'recording',
    }))
    this.recording= recording
  }

  _updateMillis= ()=> ({durationMillis, isRecording, isDoneRecording})=> {
    this.setState(currState=> ({
      ...currState,
      isRecording,
      durationMillis,
    }), ()=> this._buildTimer())
  }

  _stopRecording= async()=> {
    const { recordingStatus, isDoneRecording }= this.state
    try {
      await this.recording.stopAndUnloadAsync()
      this.setState(currState=> ({
        ...currState,
        recordingStatus: 'notrecording',
        isDoneRecording: this.recording.isDoneRecording,
      }))

    } catch (error){
      if (error.code === 'E_AUDIO_NODATA') {
        console.log(`Stop was called too quickly, no data has been received (${error.message})`)
      } else {
        console.log('STOP ERROR: ', error.code, error.name, error.message)
      }
    }
    const info= await FileSystem.getInfoAsync(this.recording.getURI() || '')
    console.log(`file info: ${JSON.stringify(info)}`)
    //const files= await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory + 'AV')
    const files= await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)

    this.setState(currState=> ({
      ...currState,
      uri:info.uri,
    }))
  }

  _toggleRecord= async ()=> {
    switch (this.state.recordingStatus) {
      case 'notrecording':
        this._startRecording()
        break;
      case 'recording':
        this._stopRecording()
        break;
      default:
        return;
    }
  }

  _buildTimer= ()=> {
    const { durationMillis, currentMillis, isRecording }= this.state
    const secs= ()=> {
      if (Math.floor(durationMillis / 1000) % 60 < 10) {
        return `0${Math.floor(durationMillis / 1000) % 60}`
      } else {
        return `${Math.floor(durationMillis / 1000) % 60}`
      }
    }
    const mins= `0${Math.floor(durationMillis / 60000)}`
    this.setState(currState=> ({
      ...currState,
      timer: `${mins}:${secs()}`,
    }))
  }

  _getSliderPosition= ()=> {
    const { currentMillis, durationMillis} = this.state
    if (currentMillis && durationMillis !== null) {
      return currentMillis / durationMillis
    } else {
      return 0
    }
  }

  _onChangeSliderPosition= async ()=> {
    await this.sound.pauseAsync()
  }

  _onSliderComplete= (value)=> {
    const { durationMillis }= this.state
    const seekPosition= value * durationMillis
    this.sound.playFromPositionAsync(seekPosition)
  }

  linkToUploadVox= ()=> {
    const { uri }= this.state
    const { selectedTrack, navigation }= this.props
    navigation.navigate('UploadVox', {uri, selectedTrack})
  }

  render() {
    const { timer, uri, isRecording, playingStatus }= this.state
    if ( uri !== null) {
      return (
        <View style={styles.playContainer}>
          <View style={ styles.playerBtnContainer}>
            <TouchableOpacity>
              <AntDesign
                name='banckward'
                size={24}
                color='black'/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._playAndPause}>
              { playingStatus === 'playing' ?
              <AntDesign
                name='pause'
                size={24}
                color='black'/>
              :
              <AntDesign
                name='play'
                size={24}
                color='black'/>}
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign
                name='forward'
                size={24}
                color='black'/>
            </TouchableOpacity>
          </View>
          <Slider
            minimumTrackTintColor={'rgb(0, 168, 115)'}
            onSlidingComplete= {this._onSliderComplete}
            onValueChange={this._onChangeSliderPosition}
            value={this._getSliderPosition()}
            />
          <Button
            title='Save'
            onPress={this.linkToUploadVox}
          />
        </View>
      )
    }
    else if ( isRecording === true) {
      return (
        <View>
          <Text>
            {timer}
          </Text>
          <TouchableOpacity
            onPress={this._toggleRecord}>
            <Entypo name='controller-stop' size={24} color='red'/>
          </TouchableOpacity>
        </View>
      )
    }
    else {
    return (
      <View style={styles.container}>
        <Text>
          {timer}
        </Text>

        <TouchableOpacity
          onPress={this._toggleRecord}
          >
          <Entypo name= 'controller-record' size={24} color='red'/>
        </TouchableOpacity>
      </View>
    )
   }
  }
}

const styles= StyleSheet.create({
  container: {
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 3,
    marginTop: 5,
  },
  playContainer: {
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 3,
    marginTop: 5,
  },
  playerBtnContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  }
})

function mapStateToProps({users, authedUser, selectedTrack}) {
  return {
    authedUser,
    selectedTrack,
    users
  }
}

export default connect(mapStateToProps)(Record)
