import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { connect } from 'react-redux'
import Login from './Login'
import Main from './Main'
import Profile from './Profile'
import Settings from './Settings'

const Stack= createStackNavigator();

const Tab= createBottomTabNavigator();
function HomeTabs() {
  return (
    <Tab.Navigator
      tabBarOptions= {{
        showLabel: false,
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused })=> {
            return (
              focused ?
            <Image
              source={require('../assets/spit_green.jpg')}
              style={{height: '100%', width: '100%'}}
            />
            :
            <Image
              source={require('../assets/spit_gray.jpg')}
              style={{height: '100%', width: '100%'}}
            />
            )
          },
        }}
      name={'Main'} component={Main}/>
      <Tab.Screen
        options={{
          tabBarIcon: ()=> {
            return (
              <Image
                source={require('../assets/profile_green.png')}
                style={{height: '100%', width: '100%'}}
              />
            )
          }
        }}
        name='Profile'
        component={Profile}/>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused })=> {
            return (
              focused ?
              <Image
                source={require('../assets/settings_green.png')}
                style={{ height: '100%', width: '100%'}}
              />
              :
              <Image
                source={require('../assets/settings_gray.png')}
                style={{ height: '100%', width: '100%'}}
              />
            )
          }
        }}
        name='Settings'
        component={Settings}/>
    </Tab.Navigator>
  )
}
class Loading extends Component {
  render() {
    const{ authedUser }= this.props
    return (
      <Stack.Navigator headerMode={'none'}>
        { authedUser === null | undefined ? (
          <Stack.Screen name='Login' component={Login}/>
        ):(
          <Stack.Screen name='Home' component={HomeTabs}/>
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
