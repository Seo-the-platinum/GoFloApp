import React, { Component } from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import Tracks from './Tracks'
import UploadVox from './UploadVox'

const Stack= createStackNavigator()

class TracksStack extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
          color: 'white',
          },
        }}
        initialRouteName= 'The Vault'>
        <Stack.Screen
          name= 'The Vault'
          component={Tracks}
          options={{
            headerLeft: props=> (
              <HeaderBackButton
                tintColor='rgb(0, 117, 88)'
                labelVisible= {false}
                onPress={()=> this.props.navigation.navigate('Profile')}
              />
            ),
            headerTintColor: 'rgb(0, 117, 88)',

          }}/>
        <Stack.Screen name= 'UploadVox' component={UploadVox}/>
      </Stack.Navigator>
    )
  }
}

export default TracksStack
