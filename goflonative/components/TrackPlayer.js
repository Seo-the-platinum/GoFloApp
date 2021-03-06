import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { connect } from 'react-redux'
import { Audio } from 'expo-av'
import { Slider } from 'react-native'
import { AntDesign, Fontisto } from '@expo/vector-icons'
import { storageRef } from '../utils/firebase'
import { setSelectedTrack } from '../actions/selectedTrack'

let _isMounted= false
class TrackPlayer extends Component {

  state={
    playingStatus: 'nosound',
    playList: [],
    index: 0,
    currentMillis: null,
    totalMillis: null,
    timer: null,
  }


  async componentDidMount() {
    _isMounted= true
    if( _isMounted= true) {
    await this._buildSongsObj()
    }
  }

 async componentWillUnmount() {
    const { playingStatus }= this.state
    _isMounted= false
    if ( playingStatus !== 'nosound') {
      await this.sound.stopAsync()
    }
  }

   _buildSongsObj= async ()=> {
     const { authedUser, users, tracks }= this.props
       const promises= tracks.map(s=> {
       const fireSource= storageRef.child(users[authedUser].tracks[s].source)
       return fireSource.getDownloadURL().then((url)=> {
        return {
           producer: users[authedUser].tracks[s].producer,
           source: url,
           title: users[authedUser].tracks[s].title,
         }
      })
   })
    await Promise.all(promises).then((res)=> {
      if (_isMounted) {
         this.setState(currState=> ({
           ...currState,
           playList: res,
         }))
       }
     })
  }

  _playAndPause= ()=> {
    switch (this.state.playingStatus) {
      case 'nosound':
        this._playRecording()
        break;
      case 'donepause':
        this._pauseAndPlayRecording()
        break;
      case 'playing':
        this._pauseAndPlayRecording();
        break;
      default:
        return;
    }
  }

  _playRecording = async ()=> {
    const { index, playList }= this.state
    const { dispatch, tracks, authedUser, users }= this.props
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    })
    const source= {uri: playList[index].source}
    /* sound is declared, contains the audio.sound object
    when _playRecording is called, it is paused by the await
    tag. once the audio.sound.createAsync is finished,
    _playRecording will continue*/
    const { sound }= await Audio.Sound.createAsync(
      /*we pass createAsync an audio source and an object
      to set the initialStatus prop of audio.sound*/
      source,
      {
        shouldPlay: true,
        isLooping: false,

      },
      /* uses this._updateScreenForSoundStatus for the
      onPlaybackStatusUpdate prop*/
      this._updateScreenForSoundStatus,
    );
    this.sound= sound
    // updates state to show that sound is playing
    if (_isMounted) {
      this.setState(currState=> ({
        playingStatus: 'playing',
      }))
    }
    dispatch(setSelectedTrack(users[authedUser].tracks[tracks[index]].source))
  }

  _updateScreenForSoundStatus = (status) => {
    if (_isMounted) {
      this.setState(currState=> ({
        ...currState,
        currentMillis: status.positionMillis,
        totalMillis: status.durationMillis,
      }), ()=> this.buildTimer())

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
  };

  _pauseAndPlayRecording= async ()=> {
    if ( this.sound != null) {
      if (this.state.playingStatus == 'playing') {
        await this.sound.pauseAsync();
        if (_isMounted) {
            this.setState(currState=> ({
              playingStatus: 'donepause'
            }))
        }
      } else {
        if (_isMounted) {
          await this.sound.playAsync();
          this.setState({
            playingStatus: 'playing',
          })
        }
      }
    }
  }

  _nextTrack= async ()=> {
    const { index, playList, playingStatus }= this.state

    if ( playingStatus === 'playing') {
      await this.sound.stopAsync();
      if (_isMounted) {
        this.setState(currState=> ({
          playingStatus: 'nosound',
        }), ()=> this._increaseIndex())
      }
    }
  if ( playingStatus === 'nosound' || playingStatus === 'donepause') {
    this._increaseIndex()
  }
}

  _increaseIndex= ()=> {
    const { index, playList }= this.state
    const { authedUser, dispatch,users,tracks }= this.props

    if (index === playList.length -1) {
      this.setState(currState=> ({
        ...currState,
        index: 0,
      }), ()=> this._playRecording())
    } else {
      this.setState(currState=> ({
        ...currState,
        index: currState.index + 1,
      }), ()=>this._playRecording())
    }
    dispatch(setSelectedTrack(users[authedUser].tracks[tracks[index]].source))
  }

  _prevTrack= async ()=> {
  const { index, playList, playingStatus }= this.state

  if ( playingStatus === 'playing') {
    await this.sound.stopAsync();
    if (_isMounted) {
      this.setState(currState=> ({
        playingStatus: 'nosound',
      }), ()=> {
        this._decreaseIndex()
      })
    }
  }
  if ( playingStatus === 'nosound' || playingStatus === 'donepause') {
    this._decreaseIndex()
  }
}

  _decreaseIndex= ()=> {
  const { index, playList }= this.state
  const { dispatch, users, authedUser, tracks }= this.props
  if (index === 0) {
  this.setState(currState=> ({
    ...currState,
    index: playList.length -1,
  }), ()=> this._playRecording())
} else {
    this.setState(currState=> ({
      ...currState,
      index: currState.index - 1,
    }), ()=>this._playRecording())
  }
  dispatch(setSelectedTrack(users[authedUser].tracks[tracks[index]].source))
}

  _getSliderPosition= ()=> {
  const { currentMillis, totalMillis }= this.state
  if ( currentMillis && totalMillis !== null) {
    return currentMillis / totalMillis
  } else {
  return  0
  }
}

  _onChangeSliderPosition= async ()=> {
  await this.sound.pauseAsync()
}

  _onSliderComplete= async (value)=> {
  const { totalMillis }= this.state
  const seekPosition= value * totalMillis
  this.sound.playFromPositionAsync(seekPosition)
}

  buildTimer= ()=> {
    const { currentMillis, totalMillis }= this.state
    if (currentMillis || totalMillis !== undefined) {
    const totalMins= `0${Math.floor(totalMillis/ 60000)}`
    const totalSecs= `${Math.floor(totalMillis/ 1000) % 60}`
    const secs= ()=> {
      if (Math.floor(currentMillis / 1000) % 60 < 10) {
        return `0${Math.floor(currentMillis / 1000) % 60}`
      } else {
        return Math.floor(currentMillis / 1000) % 60
      }
    }
    const mins= `0${Math.floor(currentMillis/ 60000)}`

    if ( totalSecs < 10 ) {
      let total=`${mins}:${secs()}/${totalMins}:0${totalSecs}`
      this.setState(currState=> ({
        ...currState,
        timer: total,
      }))
    } else {
      let total= `${mins}:${secs()}/${totalMins}:${totalSecs}`
      this.setState(currState=> ({
        ...currState,
        timer: total,
      }))
    }
  } else {
    this.setState(currState=> ({
      timer: 'Loading...'
    }))
  }
}
  render() {
    const { authedUser, tracks, users }= this.props
    const { index, playList, timer, playingStatus }= this.state
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {users[authedUser].tracks[tracks[index]].title}
          </Text>
          <Text style={styles.producer}>
            {users[authedUser].tracks[tracks[index]].producer}
          </Text>
        </View>
        <View style={styles.player}>
          <View style={ styles.playerBtns}>
            <TouchableOpacity onPress={this._prevTrack}>
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
            <TouchableOpacity onPress={this._nextTrack}>
              <AntDesign
                name='forward'
                size={24}
                color='black'/>
            </TouchableOpacity>
          </View>
          <View>
            <Slider
              value={this._getSliderPosition()}
              onValueChange={this._onChangeSliderPosition}
              onSlidingComplete={this._onSliderComplete}
              minimumTrackTintColor={'rgb(0, 168, 115)'}
            />
            <View style= {styles.timerContainer}>
              <Text>
                {this.state.timer}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({

  container: {
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 3,
    flexDirection: 'column',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  player: {
    marginTop: '5%',
  },

  playerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  producer: {
    fontWeight: 'bold',
  },

  timerContainer: {
    alignItems: 'flex-end',
  },

  title: {
    fontWeight: 'bold',
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    users,
    authedUser,
  }
}
export default connect(mapStateToProps)(TrackPlayer)
