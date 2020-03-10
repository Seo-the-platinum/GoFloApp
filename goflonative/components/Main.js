import React, { Component } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Spit from './Spit'
import Settings from './Settings'
import Profile from './Profile'


class Main extends Component {
  render() {
    return (
      <ImageBackground
        imageStyle={{resizeMode: 'stretch'}}
        source={require('../assets/MainScreen_ttable.png')}
        style={styles.backgroundImage}
        >
      </ImageBackground>
    )
  }
}

const styles= StyleSheet.create({
  backgroundImage: {
    alignItems: 'center',
    flex: 1,
    height: '90%',
    justifyContent: 'center',
    width: '100%',
  }
})
export default Main
