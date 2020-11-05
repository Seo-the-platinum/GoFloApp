import React, { Component } from 'react'
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { db } from '../utils/firebase'

class ExistingConvos extends Component {
  state={
    convosIds:[],
    sentIds:[],
    receivedIds: [],
    lastMessages:[],
    convosData: [],

  }
  componentDidMount() {
    const { authedUser, users }= this.props
    if (users[authedUser].messages !== undefined) {
      if (users[authedUser].messages.sent !== undefined) {
        const sent= users[authedUser].messages.sent
        const sIds= Object.keys(sent).map(m=> {
          return sent[m].id
        })
        this.setState(currState=> ({
          currState,
          sentIds: sIds,
        }), ()=> this.fusionHa())
      }
      if (users[authedUser].messages.received !== undefined) {
        const received= users[authedUser].messages.received
        const rIds= Object.keys(received).map(m=> {
          return received[m].id
        })
        this.setState(currState=> ({
          currState,
          receivedIds: rIds,
        }), ()=> this.fusionHa())
      }
    } else {
      return;
    }
  }

  fusionHa= ()=> {
    const { receivedIds, sentIds }= this.state
    const combined= receivedIds.concat(sentIds)
    const listOfIds= [...new Set(combined)]
    this.setState(currState=> ({
      currState,
      convos: listOfIds,
    }), ()=> this.latestMessage())
  }

  latestMessage= ()=> {
    const { authedUser, users }= this.props
    const { convos,convosData, lastMessages }= this.state
    let messagesData= db.ref('messages/')
    messagesData.on('value', snapshot=> {
      let dbMessages= snapshot.val()
      if (dbMessages !== undefined) {
      const filteredMessages= Object.keys(dbMessages).map(m => {
        if (dbMessages[m].author === authedUser ||
          dbMessages[m].recepient === authedUser) {
            return dbMessages[m]
          }})
      this.setState(currState=> ({
        currState,
        convosData: filteredMessages,
      }), ()=> this.finalList())
      }
    })
  }

  finalList= ()=> {
    const { convosData, lastMessages, sentIds, receivedIds }= this.state
    let test= convosData.sort((a,b)=> {
      return b.timeStamp - a.timeStamp
    })

  }

  render() {
    const { authedUser, users }= this.props
    const { lastMessages }= this.state
    return (
      <SafeAreaView style={styles.container}>
        <Text> testing</Text>
        <FlatList/>
      </SafeAreaView>
    )
  }
}

const styles=StyleSheet.create({
  container: {
    flex:1,
    borderColor: 'red',
    borderWidth: 2,

  }
})

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(ExistingConvos)
