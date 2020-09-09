import React, { Component } from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Spit from './Spit'
import Settings from './Settings'
import Profile from './Profile'
import { auth, db } from '../utils/firebase'
import { connect } from 'react-redux'
import { setAuthedUser } from '../actions/authedUser'
import Login from './Login'

class Main extends Component {

  signOut=()=> {
    const { dispatch }= this.props
    db.ref().child('/users/' + auth.currentUser.uid ).update({
      online: false,
    }).then(()=> {
    auth.signOut().then(()=> {
    this.props.dispatch(setAuthedUser(null))
    this.navigation.navigate('Login')
    }).catch(function(error) {
    console.log('someting wong')
    });
  })
}
  render() {
    return (
      <ImageBackground
        imageStyle={{resizeMode: 'stretch'}}
        source={require('../assets/MainScreen_ttable.png')}
        style={styles.backgroundImage}
      >
        <TouchableOpacity onPress={this.signOut}>
          <Text style={{color: 'white'}}> sign out</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/SPIT_Grid_bars.png')}
        />
      </ImageBackground>
    )
  }
}

const styles= StyleSheet.create({
  backgroundImage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  }
})

export default connect()(Main)
