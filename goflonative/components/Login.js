import React, { Component } from 'react'
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View, } from 'react-native'
import LoginField from './LoginField'
import MediaSignUp from './MediaSignUp'
import { connect } from 'react-redux'

class Login extends Component {
  render() {
    return (
      <ImageBackground
        imageStyle={{resizeMode: 'stretch'}}
        source={require('../assets/MainScreen.png')}
        style={styles.backgroundImage}
        >
        <View style={styles.loginContainer}>
          <LoginField />
          <MediaSignUp/>
        </View>
      </ImageBackground>
    )
  }
}

const styles= StyleSheet.create({
  backgroundImage: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  loginContainer: {
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '65%',
  }
})


export default Login
