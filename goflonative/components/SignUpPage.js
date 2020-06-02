import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View } from 'react-native'

class SignUpPage extends Component {
  state={
    username:'',
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          hello
        </Text>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    borderWidth: 1,
    flex: 1,
    width: '100%',
  },

  username: {
    borderColor: 'black',
    borderWidth: 1,
  }
})

export default SignUpPage
