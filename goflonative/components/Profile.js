import React, { Component } from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View } from 'react-native'
import { connect } from 'react-redux'


class Profile extends Component {

  render() {
    const { authedUser, users }= this.props
    const pic= users[authedUser].profilePic
    return (
      <View>
        <View style={styles.ProfileHeader}>
          <Text
            style={styles.ProfileHeaderText}
            > { authedUser }</Text>
        </View>
        <View style={styles.ProfileTop}>
          <Image source={pic}/>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonContainer}>
              <Text>Tracks</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Leaderboards</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Customize</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Messages</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  backgroundImage: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContainer: {
    height: '20%',
    width: '100%',
  },
  buttonsContainer: {
    borderColor: 'green',
    borderWidth: 2,
    width: '100%',
  },
  ProfileHeader: {
    alignItems: 'center',
    backgroundColor: 'black',
    height: '20%',
    justifyContent: 'flex-end',
  },
  ProfileHeaderText: {
    color: 'silver',
    fontSize: 24,
  },
  ProfileTop: {
    borderColor: 'orange',
    borderWidth: 2,
    flexDirection: 'row',
  },

})

function mapStateToProps({ authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Profile)
