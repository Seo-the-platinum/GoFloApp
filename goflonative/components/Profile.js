import React, { Component } from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { connect } from 'react-redux'
import FriendsList from './FriendsList'
import { Audio } from 'expo-av'
import { createStackNavigator } from '@react-navigation/stack'
import ArtistPage from './ArtistPage'



class Profile extends Component {

  state= {
    playingStatus: 'nosound',
    secs: 0,
    mins: 0,
    total: 0,
  }
//the play recording function is an async function
  _playRecording = async ()=> {
    /* sound is declared, contains the audio.sound object
    when _playRecording is called, it is paused by the await
    tag. once the audio.sound.createAsync is finished,
    _playRecording will continue*/
    const { sound }= await Audio.Sound.createAsync(
      /*we pass createAsync an audio source and an object
      to set the initialStatus prop of audio.sound*/
      require('../assets/sounds/heavenandhell.mp3'),
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

/*_updateScreenForSoundStatus takes status as a parameter
and receives it from the createAsync object. */
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

  /* checks to see if the value of sound doesn't equal null
  if it doesn't checks playingStatus, if playing,
  await this.sound.pauseAsync is called to pause sound.
  else await this.sound.playAsync is called to play sound*/
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


  _playAndPause = ()=> {
    console.log(this.state.playingStatus)
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

  linkToArtist=()=> {
    this.props.navigation.navigate('ArtistPage')
  }

  linkToTracks=()=> {
    this.props.navigation.navigate('Tracks')
  }

  linkToLeaderboards=()=> {
    this.props.navigation.navigate('Leaderboards')
  }

  linkToCustomize=()=> {
    this.props.navigation.navigate('Customize')
  }

  linkToMessages=()=> {
    this.props.navigation.navigate('Messages')
  }

  render() {
    const { authedUser, users }= this.props
    const pic= users[authedUser].profilePic
    const { secs, mins } = this.state
    let displaySecs= secs < 10 ? '0' + secs : secs
    let displayMins= mins < 10 ? '0' + mins : mins
    let timer= `${displayMins}:${displaySecs} / ${this.state.total}`
    console.log(timer)
    return (
      <View>
        <View style={styles.ProfileHeader}>
          <Text
            style={styles.ProfileHeaderText}
            > { authedUser }</Text>
        </View>
        <View style={styles.ProfileTop}>
          <Image
            source={pic}
            style={{flex: 1}}/>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.linkToArtist}>
              <ImageBackground
                source={require('../assets/SPIT_Grid_bars.png')}
                style={styles.backgroundImage}
                >
                <ImageBackground
                  source={require('../assets/SPIT_B_bars.png')}
                  style={styles.layeredBackgroundImage}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold'}}>
                    Artist Page</Text>
                </ImageBackground>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.linkToTracks}
            >
              <ImageBackground
                source={require('../assets/SPIT_Grid_bars.png')}
                style={styles.backgroundImage}
              >
                <ImageBackground
                  source={require('../assets/SPIT_W_bars.png')}
                  style={styles.layeredBackgroundImage}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Text
                    style={{
                    fontWeight: 'bold'}}>
                    Tracks
                  </Text>
                </ImageBackground>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.linkToLeaderboards}
            >
              <ImageBackground
                source={require('../assets/SPIT_Grid_bars.png')}
                style={styles.backgroundImage}
              >
                <ImageBackground
                  source={require('../assets/SPIT_W_bars.png')}
                  style={styles.layeredBackgroundImage}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Text
                    style={{
                    fontWeight: 'bold'}}>
                    Leaderboards
                  </Text>
                </ImageBackground>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.linkToCustomize}
              >
              <ImageBackground
                source={require('../assets/SPIT_Grid_bars.png')}
                style={styles.backgroundImage}
                >
                <ImageBackground
                  source={require('../assets/SPIT_W_bars.png')}
                  style={styles.layeredBackgroundImage}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Text
                    style={{
                    fontWeight: 'bold'}}>
                    Customize
                  </Text>
                </ImageBackground>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.linkToMessages}
            >
              <ImageBackground
                source={require('../assets/SPIT_Grid_bars.png')}
                style={styles.backgroundImage}
                >
                <ImageBackground
                  source={require('../assets/SPIT_W_bars.png')}
                  style={styles.layeredBackgroundImage}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Text
                    style={{
                    fontWeight: 'bold',
                    }}>
                    Messages
                  </Text>
                </ImageBackground>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <FriendsList/>
        <View style={styles.gridView}>
          <Image
            source={require('../assets/SPIT_Grid_bars.png')}
            style={{width: '100%'}}
            imageStyle={{resizeMode: 'contain'}}
          />
        </View>
        <TouchableOpacity
          onPress={()=> this._playAndPause()}>
          {this.state.playingStatus === 'playing' ? (
              <Text> Pause</Text>
          )
          :
          (
            <Text> Play</Text>
          )}
        </TouchableOpacity>
        <Text>{timer}</Text>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  backgroundImage: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  layeredBackgroundImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonsContainer: {
    flex: 2,
    width: '100%',
  },
  gridView: {
    position: 'relative',
    top: '43%',
  },
  ProfileHeader: {
    alignItems: 'center',
    backgroundColor: 'black',
    height: '20%',
    justifyContent: 'flex-end',
  },
  ProfileHeaderText: {
    color: 'silver',
    fontSize: 24,
  },
  ProfileTop: {
    flexDirection: 'row',
  },

})

function mapStateToProps({ authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Profile)
