import React, { Component } from 'react'
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View } from 'react-native'
import { connect } from 'react-redux'


class FriendsList extends Component {
  state={
    online: [],
    offline: [],
  }

  componentDidMount() {
    this.getFriends()
  }

  getFriends= ()=> {
    const { users, authedUser }= this.props
    if (users[authedUser].friends !== undefined) {
      const onlineData= Object.keys(users[authedUser].friends).filter(index=> {
        return users[users[authedUser].friends[index]].online === true
      })
      const offlineData= Object.keys(users[authedUser].friends).filter(index=> {
        return users[users[authedUser].friends[index]].online === false
      })
      this.setState(currState=> ({
        currState,
        online: onlineData,
        offline: offlineData,
      }))
    } else {
      return ;
    }
  }

  render() {
    const { online, offline }= this.state
    const { users, authedUser }= this.props

    return (
      <View>
        <View style={styles.header}>
          <Text> Friends List</Text>
        </View>
        <View>
          <ImageBackground
            source={require('../assets/spitBAck.png')}
            style={styles.friendsView}
            imageStyle={{resizeMode: 'stretch'}}
          >
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <Text style={{color:'white'}}>
                ONLINE
              </Text>
              <View style={styles.onlineView}>
                { online !== undefined ? (
                  online.map(i=> {
                  return (
                    <Text
                      key={i}
                      style={{color: 'white'}}>
                      {users[users[authedUser].friends[i]].displayName}
                    </Text>
                  )
                })): null
              }
              </View>
            </View>
            <View
              style={{
                flex:1,
                alignItems: 'flex-start',
              }}>
              <Text style={{color: 'white'}}>
                OFFLINE
              </Text>
                <View style={styles.offlineView}>
               {  offline !== undefined ? (
                 offline.map(i => {
                 return (
                 <Text
                   style={{color: 'white'}}
                   key={i}>
                   {users[users[authedUser].friends[i]].displayName}
                 </Text>
               )
             })): null}
               </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  header: {
    backgroundColor: 'silver',
    width: '100%',
  },
  friendsView: {
    flexDirection: 'row',
    width: '100%',
  },
  offlineView: {
    alignItems: 'center',
    width: '90%',
  },
  onlineView: {
    alignItems: 'center',
    width: '90%',
  },
  title: {
    color: 'white',
  }
})

function mapStateToProps({ users, authedUser }) {
  return {
    users,
    authedUser
  }
}
export default connect(mapStateToProps)(FriendsList)
