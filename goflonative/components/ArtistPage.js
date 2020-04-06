import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View } from 'react-native'
import { connect } from 'react-redux'

class ArtistPage extends Component {
  render() {
    const { authedUser, users }= this.props
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={{
            color: 'white',
            fontSize: 36,}}> Artist Page</Text>
        </View>
        <View style={styles.artistHeader}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,}}
            >{ users[authedUser].artistName }
          </Text>
          <Image
            source={require('../assets/pleasurables.jpg')}
            style={{
              flex: 1,
              resizeMode: 'contain',}}
            />
        </View>
        <View style={styles.aboutMe}>
          <Text style={{color: 'white'}}>
            ABOUT ME
          </Text>
          <View>
            <Text style={{color: 'white'}}>
              {users[authedUser].artistAbout}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  artistHeader: {
    flex: .15,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  container: {
    flex: 1,
    backgroundColor: 'gray',
  },

  headerView: {
    alignItems: 'center',
    backgroundColor: 'black',
  },

  aboutMe: {
    backgroundColor: 'gray',
    flex: 1,
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    users,
    authedUser,
  }
}
export default connect(mapStateToProps)(ArtistPage)
