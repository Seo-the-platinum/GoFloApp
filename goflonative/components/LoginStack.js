import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login'
import SignUpPage from './SignUpPage'
import { CommonActions } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

 const Stack= createStackNavigator()

 export default function MediaSignUpStack() {
   
   return (
     <Stack.Navigator
       headerMode={'screen'}
       initialRouteName='Login'
       screenOptions={{
         headerStyle: {
           backgroundColor: 'black',
         },
         headerTintColor: 'rgb(0, 117, 105)',
         headerTitleStyle: {
           color: 'rgb(0, 117, 105)',
         },
       }}>
       <Stack.Screen
       name='Login'
       component={ Login }
       />
       <Stack.Screen
         component={ SignUpPage }
         name='SignUpPage'
         />
     </Stack.Navigator>
   )
 }
