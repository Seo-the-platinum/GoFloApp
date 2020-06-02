import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity } from 'react-native'
import Expo from 'expo'

class MediaSignUp extends Component {

  loginFb= async ()=> {
    await Expo.Facebook.logInWithReadPermissionsAsync(
      id,
      {permissions: ['public_profile', 'email', 'user_friends']}
    )
    if ( type === 'success') {

      const response= await fetch()
    } else {

    }
  }

  loginTw= ()=> {
    console.log('Twitter')
  }

  loginSc= ()=> {
    console.log('Soundcloud')
  }

  linkToSignUp= ()=> {
    this.props.navigation.navigate('SignUpPage')
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
