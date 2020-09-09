import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './components/Login'
import Main from './components/Main'
import Loading from './components/Loading'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers/index'
import middleware from './middleware/index'
import { connect } from 'react-redux'

class App extends Component {

  render() {
    const { authedUser }=this.props
    return (
      <Provider store= {createStore(reducer, middleware)}>
        <NavigationContainer>
          <Loading/>
        </NavigationContainer>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App
