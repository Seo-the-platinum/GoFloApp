import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity } from 'react-native'

class MediaSignUp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/btn_fb02.png')}
          style={styles.backgroundImage}>
            <TouchableOpacity></TouchableOpacity>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/btn_tw02.png')}
          style={styles.backgroundImage}>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/btn_SC02.png')}
          style={styles.backgroundImage}>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/btn_SU02.png')}
          style={styles.backgroundImage}>
        </ImageBackground>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    borderColor: 'blue',
    borderWidth: 1,
    height: '35%',
    width: '100%',
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  }
})
export default MediaSignUp
