import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { db } from '../utils/firebase'
import { connect } from 'react-redux'

class Conversation extends Component {
  render() {
    const { displayName }= this.props
    const { name, url }= this.props.route.params
    console.log('url and name should be here', name, url)
    return (
      <View>
        <Text> {name} </Text>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
  }
})

function mapStateToProps({authedUser,users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Conversation)
