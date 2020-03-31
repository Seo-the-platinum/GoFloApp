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

class Profile extends Component {

  state= {
    playingStatus: 'nosound',
  }

  _playRecording = async ()=> {
    const { sound }= await Audio.Sound.createAsync(
      require('../assets/sounds/heavenandhell.mp3'),
      {
        shouldPlay: true,
        isLooping: false,
      },
      this._updateScreenForSoundStatus,
    );
    this.sound= sound
    this.setState(currState=> ({
      playingStatus: 'playing',
    }))
  }

  _updateScreenForSoundStatus = (status) => {
    if (status.isPlaying && this.state.playingStatus !== "playing") {
      this.setState({ playingStatus: "playing" });
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

  render() {
    const { authedUser, users }= this.props

    const pic= users[authedUser].profilePic
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
            <TouchableOpacity style={styles.buttonContainer}>
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
            <TouchableOpacity style={styles.buttonContainer}>
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
            <TouchableOpacity style={styles.buttonContainer}>
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
            <TouchableOpacity style={styles.buttonContainer}>
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
            <TouchableOpacity style={styles.buttonContainer}>
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
          <Text> Play</Text>
        </TouchableOpacity>
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
