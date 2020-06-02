import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login'
import SignUpPage from './SignUpPage'

 const Stack= createStackNavigator()

 export default function MediaSignUpStack() {
   return (
     <Stack.Navigator
       headerMode={'none'}
       initialRouteName='Login'>
       <Stack.Screen name='Login' component={ Login }/>
       <Stack.Screen name='SignUpPage' component={ SignUpPage }/>
     </Stack.Navigator>
   )
 }
