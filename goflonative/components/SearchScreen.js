import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import FindFriends from './FindFriends'

class SearchScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FindFriends/>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
  }
})

export default SearchScreen
