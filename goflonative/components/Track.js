import React, { Component } from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { Audio } from 'expo-av'

 class Track extends Component {
   render() {
     const { users, authedUser, track }= this.props
     const producer= users[authedUser].tracks[track].producer
     const genre= users[authedUser].tracks[track].genre
     const title= users[authedUser].tracks[track].title

     return (
       <View style={styles.container}>
         <View style={{flex: 2}}>
           <Text style={styles.title}>
             {title}
           </Text>
         </View>
         <View style={{flex: 1}}>
           <Text>
             {producer}
           </Text>
         </View>
         <View style={{flex: 1, alignItems: 'flex-end'}}>
           <Text>
             {genre}
           </Text>
         </View>
       </View>
     )
   }
 }

const styles= StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  buttonImage: {
    height: 50,
    width: 50,
  },
  buttonView: {
    flex: .5,
    marginRight: '5%',
  },
  title: {
    fontSize: 18,
  },
})
function mapStateToProps({users, authedUser}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(Track)
