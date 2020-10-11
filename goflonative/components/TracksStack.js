import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Tracks from './Tracks'
import UploadVox from './UploadVox'

const Stack= createStackNavigator()

class TracksStack extends Component {
  render() {
    return (
      <Stack.Navigator initialRouteName= 'The Vault' headerMode='none'>
        <Stack.Screen name= 'The Vault' component={Tracks}/>
        <Stack.Screen name= 'UploadVox' component={UploadVox}/>
      </Stack.Navigator>
    )
  }
}

export default TracksStack
