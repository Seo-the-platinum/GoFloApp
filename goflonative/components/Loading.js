import React, { Component } from 'react'
import { Button, Image, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { connect } from 'react-redux'
import LoginStack from './LoginStack'
import Main from './Main'
import ProfileStack from './ProfileStack'
import Settings from './Settings'
import { auth, db } from '../utils/firebase'
import { FontAwesome } from '@expo/vector-icons';
import SearchScreen from './SearchScreen'

const Stack= createStackNavigator();

const Tab= createBottomTabNavigator();


function HomeTabs() {

  return (
    <Tab.Navigator
      tabBarOptions= {{
        showLabel: false,
        style: {
          height: '7%',
          paddingBottom: 0,
          backgroundColor: 'rgb(0, 117, 88)'
        }
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
        component={ProfileStack}/>
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
        name='Settings' component={Settings}/>
      <Tab.Screen
        options={{
          tabBarIcon:()=> {
            return (
              <FontAwesome
                name="search-plus"
                size={24}
                color="black"
                />
            )
          }
        }}
        name='Search'
        component={SearchScreen}/>
    </Tab.Navigator>
  )
}


class Loading extends Component {

  componentDidMount() {
    auth.onAuthStateChanged((user)=> {
      if (user) {
        console.log('loading...', user)
      } else {
        console.log('no user found')
      }
    })
  }

  render() {
    const { authedUser }= this.props
    return (
      <Stack.Navigator headerMode={'none'}>
        { authedUser === null | undefined ? (
          <Stack.Screen name='Login' component={LoginStack}
            />
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
