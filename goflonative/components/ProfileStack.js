import React, { Component } from 'react'
import { Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from './Profile'
import ArtistPage from './ArtistPage'
import Tracks from './Tracks'
import Messages from './Messages'
import Leaderboards from './Leaderboards'
import Customize from './Customize'
import { auth } from '../utils/firebase'

const Stack= createStackNavigator();

export default function ProfileStack(){
    return (
      <Stack.Navigator
        headerMode={'float'}
        screenOptions= {{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleStyle: {
            color: 'white',
          }
        }}
        initialRouteName={auth.currentUser.displayName}>
        <Stack.Screen name='ArtistPage' component={ArtistPage}/>
        <Stack.Screen
          name={auth.currentUser.displayName}
          component={Profile}
        />
        <Stack.Screen name='Tracks' component={Tracks}/>
        <Stack.Screen
          name='Customize'
          component={Customize}
          />
        <Stack.Screen name='Leaderboards' component={Leaderboards}/>
        <Stack.Screen name='Messages' component={Messages}/>
      </Stack.Navigator>
    )
  }
