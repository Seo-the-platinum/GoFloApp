import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity } from 'react-native'
import Expo from 'expo'
import { db, auth } from '../utils/firebase'
import * as Facebook from 'expo-facebook'
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'
import { setAuthedUser } from '../actions/authedUser'

class MediaSignUp extends Component {

  componentDidMount() {
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
        console.log(user);
    }
  });
}

  loginFb= async ()=> {
    await Facebook.initializeAsync('251209479296772')

    const { type, token }= await Facebook.logInWithReadPermissionsAsync(
    { permissions: ['public_profile','email'] }
    )
    if (type === 'success') {
      console.log('heres our token from fb!!',token)
      const credential= firebase.auth.FacebookAuthProvider.credential(token)

      firebase.auth().signInWithCredential(credential)
      .then(()=> { console.log(firebase.auth().currentUser.uid)
      this.addUserToDb(firebase.auth().currentUser.uid)})
      .catch(error=> console.log(error))
    }
  }

  loginTw= async ()=> {
    const provider= new firebase.auth.TwitterAuthProvider()
    await firebase.auth().signInWithPopup(provider)
    .then((result)=> {
        const token= result.credential.accessToken
        const secret= result.credential.secret
        const user= result.user
      })
      .catch((error)=> console.log(error))
  }

  loginSc= ()=> {
    console.log('Soundcloud')
  }

  linkToSignUp= ()=> {
    this.props.navigation.navigate('SignUpPage')
  }

  addUserToDb= async (userId)=> {
    const { dispatch }= this.props
    if (db.ref('users/' + userId) === undefined ) {
    await db.ref('users/' + userId).set({
      artistAbout: 'Tell us about you...',
      artistName: 'Artist or Group name here...',
      favoriteArtist: ['Artist1', 'Artist2', 'Artist3'],
      online: true,
      profilePic: {
        imgName: 'defaultUserpic.jpg',
      },
      tracks: null,
    })}
    dispatch(setAuthedUser(userId))
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.loginFb}
          style={{flex: 1}}
          activeOpacity={.1}
        >
          <ImageBackground
            source={require('../assets/btn_fb02.png')}
            style={styles.backgroundImage}>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.loginTw}
          activeOpacity={.1}
          style={{flex: 1}}
        >
          <ImageBackground
            source={require('../assets/btn_tw02.png')}
            style={styles.backgroundImage}>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.loginSc}
          activeOpacity={.1}
          style={{flex: 1}}
        >
          <ImageBackground
            source={require('../assets/btn_SC02.png')}
            style={styles.backgroundImage}>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.linkToSignUp}
          activeOpacity={.1}
          style={{flex: 1}}
        >
          <ImageBackground
            source={require('../assets/btn_SU02.png')}
            style={styles.backgroundImage}>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    overflow: 'hidden',
    height: '35%',
    width: '100%',
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  }
})
export default MediaSignUp
