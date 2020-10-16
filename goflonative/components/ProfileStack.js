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
import TracksStack from './TracksStack'

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
          },
        }}
        initialRouteName='profile'>
        <Stack.Screen
          name='ArtistPage'
          component={ArtistPage}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}/>
        <Stack.Screen
          name='profile'
          component={Profile}
          options={()=> {
              if (auth.currentUser.displayName) {
                return {
                  title: `Hello, ${auth.currentUser.displayName}`
                }
              } else {
                return {title: 'Hello User!'}
              }
            }
          }
        />
        <Stack.Screen
          name='The Vault'
          component={TracksStack}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}/>
        <Stack.Screen
          name='Customize'
          component={Customize}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}
          />
        <Stack.Screen
          name='Leaderboards'
          component={Leaderboards}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}
          />
        <Stack.Screen
          name='Messages'
          component={Messages}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}/>
      </Stack.Navigator>
    )
  }
