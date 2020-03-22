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
  render() {
    const { users, authedUser }= this.props
    const onlineData= Object.keys(users).filter(u=>
      users[u].online === true && users[u].userName !== u
    )
    const offlineData= Object.keys(users).filter(u=>
      users[u].online === false
    )
    console.log(onlineData, offlineData)
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
                {onlineData.map(i=> {
                  return (
                    <Text
                      key={i}
                      style={{color: 'white'}}>
                      {users[i].userName}
                    </Text>
                  )
                })}
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
               {offlineData.map(i => {
                 return (
                 <Text
                   style={{color: 'white'}}
                   key={i}>
                   {users[i].userName}
                 </Text>
               )
               })}
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
    borderLeftColor: 'white',
    borderLeftWidth: 3,
    alignItems: 'center',
    width: '90%',
  },
  onlineView: {
    borderLeftColor: 'white',
    borderLeftWidth: 3,
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
