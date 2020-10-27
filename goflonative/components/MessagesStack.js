import React, { Component } from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import Messages from './Messages'
import NewMessage from './NewMessage'
import Conversation from './Conversation'
import { Image, Text, View } from 'react-native'

const Stack= createStackNavigator()


export default function MessagesStack({navigation}) {
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
      }}>
      <Stack.Screen
      component={Messages}
      name='Messages'
      options={{
        headerLeft: props=> (
          <HeaderBackButton
            tintColor='rgb(0, 117, 88)'
            labelVisible= {false}
            onPress={()=> navigation.navigate('Profile')}
          />
        ),
        headerTintColor: 'rgb(0, 117, 88)',

      }}
      />
      <Stack.Screen
        name='NewMessage'
        component={NewMessage}
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'New Message',
          headerTintColor: 'rgb(0, 117, 88)',
      }}/>
      <Stack.Screen
        name='Conversation'
        component={Conversation}
        options={({route})=> ({
          headerBackTitleVisible: false,
          headerTitle: props => (
            <View style={{flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            flex:1,}}>
              <Image
                source={{uri: route.params.url}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                }}/>
              <Text style={{color: 'white'}}> {route.params.name}</Text>
            </View>),
          headerTintColor:'rgb(0, 117, 88)',
        })
        }
      />
    </Stack.Navigator>
  )
}
