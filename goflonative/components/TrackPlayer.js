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


class TrackPlayer extends Component {

  state={
    playingStatus: 'nosound',
    secs: 0,
    mins: 0,
    total: 0,
    playList: [],
    index: 0,
    rate: 0,
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

  componentWillUnmount() {
    this._isMounted= false
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
    console.log(Math.round((status.positionMillis /status.durationMillis)*100)/100)
    setTimeout(()=> {
      this.setState(currState=> ({
        ...currState,
        rate: Math.round((status.positionMillis /status.durationMillis)*100)/100,
      }))
    }, 500)
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
      }), ()=> this._increaseIndex())
  }
  if ( playingStatus === 'nosound' || playingStatus === 'donepause') {
    this._increaseIndex()
  }
}

_increaseIndex= ()=> {
    const { index, playList }= this.state

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
  }

_prevTrack= async ()=> {
  const { index, playList, playingStatus }= this.state

  if ( playingStatus === 'playing') {
    console.log('stopping...')
    await this.sound.stopAsync();
    console.log('stopped')
    this.setState(currState=> ({
      playingStatus: 'nosound',
    }), ()=> {
      this._decreaseIndex()
    })
  }
  if ( playingStatus === 'nosound' || playingStatus === 'donepause') {
    this._decreaseIndex()
  }
}

_decreaseIndex= ()=> {
  const { index, playList }= this.state

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
}
  render() {
    const { authedUser, tracks, users }= this.props
    const { index, playList, mins, secs, total, rate }= this.state
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
              <Text>
                Prev
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._playAndPause}>
              <Image
                source={require('../assets/playBtn.jpg')}
                style={{
                  width: 50,
                  height: 50}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._nextTrack}>
              <Text>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Slider/>
            <Text>
              {`${mins}: ${secs} / ${total}`}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({

  container: {
    borderColor: 'blue',
    borderWidth: 1,
    flexDirection: 'column',
  },

  header: {
    borderColor: 'green',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  player: {
    borderColor: 'red',
    borderWidth: 1,
  },

  playerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  producer: {
    fontWeight: 'bold',
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
