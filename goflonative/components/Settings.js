import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { connect } from 'react-redux'

class Settings extends Component {
  render() {
    return (
      <View>
        <Text>Settings</Text>
      </View>
    )
  }
}

function mapStateToProps({ authedUser, users }) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Settings)
