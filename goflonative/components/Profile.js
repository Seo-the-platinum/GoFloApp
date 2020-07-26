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
import { auth, storageRef } from '../utils/firebase'
import UpdatedImage from './UpdatedImage'

class Profile extends Component {
  state= {
    imgUri: null,
    loading: true,
  }

  async componentDidMount() {
    const { authedUser, users }= this.props
    if ( users[authedUser].profilePic !== undefined ) {
      await this.getUri()
    } else {
      await this.getDefaultUri()
    }
  }

  getUri= ()=> {
    const { authedUser, users }= this.props
    const fireSource= storageRef.child(`images/${users[authedUser].profilePic.imgName}`)
    return fireSource.getDownloadURL().then((url)=> {
      this.setState(currState=> ({
        imgUri: url,
        loading: false,
      }))
    })
  }

  getDefaultUri= ()=> {
    const { authedUser, users }= this.props
    const fireSource= storageRef.child('images/defaultUserpic.jpg')
    return fireSource.getDownloadURL().then((url)=> {
      this.setState(currState=> ({
        imgUri: url,
        loading: false,
      }))
    })
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
    const { imgUri, loading }= this.state
    const { displayName }= auth.currentUser
    if ( loading === false ) {
    return (
      <View>
        <View style={styles.ProfileTop}>
          <UpdatedImage/>
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
      </View>
    )} else { return (null)}
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

function mapStateToProps({ authedUser, users,}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Profile)
