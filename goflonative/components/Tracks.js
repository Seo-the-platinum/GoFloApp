import React, { Component } from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  View } from 'react-native'
import { connect } from 'react-redux'
import Track from './Track'
import TrackPlayer from './TrackPlayer'
import { fireStore } from '../utils/firebase'


class Tracks extends Component {

  render() {
    const { authedUser, users }= this.props
    const tracks= Object.keys(users[authedUser].tracks)
    return (
      <View>
        <View style={styles.headerView}>
          <Text style={styles.headerText}> THE VAULT </Text>
        </View>
        <View style={styles.credits}>
          <ImageBackground
            style={styles.creditsBackground}
            source={require('../assets/SPIT_Grid_bars.png')}>
            <Text
              style={styles.creditsText}>
              Track
            </Text>
            <Text
              style={styles.creditsText}>
              Producer
            </Text>
            <Text
              style={styles.creditsText}>
              Genre
            </Text>
          </ImageBackground>
        </View>
        {tracks.map(t => {
          return <Track
                   key={t}
                   track={t}
                  />
        })}
        <View>
          <TrackPlayer tracks={tracks}/>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  credits: {
    height: '15%',
  },
  creditsBackground: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  creditsText: {
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
  headerText: {
    color: 'silver',
    fontSize:  36,
    fontWeight: 'bold',
  },
  headerView: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
    height: '20%',
    justifyContent: 'flex-end',
  },
})
function mapStateToProps({users, authedUser}) {
  return  {
    authedUser,
    users
  }
}
export default connect(mapStateToProps)(Tracks)
