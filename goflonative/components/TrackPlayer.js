import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { connect } from 'react-redux'
import { Audio } from 'expo-av'


class TrackPlayer extends Component {
  state={
    playingStatus: 'nosound',
    secs: 0,
    mins: 0,
    total: 0,
    playList: [],
    index: 0,
  }
  componentDidMount() {
    const { users, authedUser, tracks }= this.props
    const trackList= tracks.map(s=> {
      return {
        title: users[authedUser].tracks[s].title,
        source: users[authedUser].tracks[s].source,
        producer: users[authedUser].tracks[s].producer,
      }
    })
    this.setState(currState=> ({
      ...currState,
      playList: trackList,
    }))
  }
  
  _playAndPause= ()=> {
    switch (this.state.playingStatus) {
      case 'nosound':
        this._playRecording()
        break;
      case 'donepause':
      case 'playing':
        this._pauseAndPlayRecording();
        break;
      default:
        return;
    }
  }

  _playRecording = async ()=> {
    const { index, playList }= this.state
    /* sound is declared, contains the audio.sound object
    when _playRecording is called, it is paused by the await
    tag. once the audio.sound.createAsync is finished,
    _playRecording will continue*/
    const { sound }= await Audio.Sound.createAsync(
      /*we pass createAsync an audio source and an object
      to set the initialStatus prop of audio.sound*/
      playList[index].source,
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
    this.setState(currState=> ({
      playingStatus: 'playing',
    }))
  }

  _updateScreenForSoundStatus = (status) => {
    this.setState(currState=> ({
      ...currState,
      secs: Math.round(status.positionMillis / 1000 %60),
      total: `${Math.floor(status.durationMillis / 60000)}: ${Math.floor(status.durationMillis/ 1000 % 60)}`,
    }))
    if (this.state.secs >= 60) {
      this.setState(currState=> ({
        ...currState,
        mins: this.state.mins + 1,
      }))
    }

    /*if audio.sound.status.isPlaying is true and playingStatus
    does not equal playing, the setstate to playing */
    if (status.isPlaying && this.state.playingStatus !== "playing") {
      this.setState({ playingStatus: "playing" });
      /* if isPlaying is not true and playingstatus is playingStatus
      change state to donepause*/
    } else if (!status.isPlaying && this.state.playingStatus === "playing") {
      this.setState({ playingStatus: "donepause" });
    }
  };

  _playNext= async ()=> {
    const { playingStatus, index, playList }= this.state
      if (this.sound != null) {
        console.log('playing...' + index)
        await this.sound.playAsync();
        console.log('playing')
        this.setState(currState=>({
          playingStatus: 'playing',
        }))
      }
    }

  _pauseAndPlayRecording= async ()=> {
    if ( this.sound != null) {
      if (this.state.playingStatus == 'playing') {
        console.log('pausing...')
        await this.sound.pauseAsync();
        console.log('paused')
        this.setState(currState=> ({
          playingStatus: 'donepause'
        }));
      } else {
        console.log('playing...')
        await this.sound.playAsync();
        console.log('playing')
        this.setState({
          playingStatus: 'playing',
        })
      }
    }
  }

  _nextTrack= async ()=> {
    const { index, playList, playingStatus }= this.state

    if ( playingStatus === 'playing') {
      console.log('stopping...')
      await this.sound.stopAsync();
      console.log('stopped')
      this.setState(currState=> ({
        playingStatus: 'nosound',
      }), ()=> {
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
    })
  }
}
  render() {
    const { tracks }= this.props
    const { playList, index }= this.state

    return (
      <View>
        <View>
          <Text>Title</Text>
          <Text>Artist</Text>
        </View>
        <TouchableOpacity
          onPress={this._playAndPause}>
          <Image source={require('../assets/playBtn.jpg')}/>
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={this._nextTrack}>
            <Text>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

function mapStateToProps({users, authedUser}) {
  return {
    users,
    authedUser,
  }
}
export default connect(mapStateToProps)(TrackPlayer)
