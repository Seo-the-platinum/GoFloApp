import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { AntDesign } from '@expo/vector-icons';

class FindFriends extends Component {
  render() {
    return (
      <View style={styles.container}>
      <AntDesign name="search1" size={24} color="black" />
        <TextInput
          placeholder='add friends'
          placeholderTextColor='black'/>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    height: '10%',
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(FindFriends)
