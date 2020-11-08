import React, { Component } from 'react'
import { Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from './Profile'
import ArtistPage from './ArtistPage'
import Tracks from './Tracks'
import MessagesStack from './MessagesStack'
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
        initialRouteName='Profile'>
        <Stack.Screen
          name='ArtistPage'
          component={ArtistPage}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
          }}/>
        <Stack.Screen
          name='Profile'
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
            headerShown: false,
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
          component={MessagesStack}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: 'rgb(0, 117, 88)',
            headerShown: false,
          }}/>
      </Stack.Navigator>
    )
  }
