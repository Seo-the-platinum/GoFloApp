import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import Login from './Login'
import Main from './Main'

const Stack= createStackNavigator();

class Loading extends Component {
  render() {
    const{ authedUser }= this.props
    return (
      <Stack.Navigator>
        { authedUser === null | undefined ? (
          <Stack.Screen name='Login' component={Login}/>
        ):(
          <Stack.Screen name='Main' component={Main}/>
        )}
      </Stack.Navigator>
    )
  }
}

function mapStateToProps({ authedUser}) {
  return {
    authedUser,
  }
}

export default connect(mapStateToProps)(Loading)
