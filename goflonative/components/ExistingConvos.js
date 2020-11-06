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
import { db, storageRef } from '../utils/firebase'

class ExistingConvos extends Component {
  state= {
    convos: [],
    convosData: [],
    otherUids: [],
    messagesData: [],
    uIds: [],
  }
  componentDidMount() {
    const{ authedUser }= this.props
    const membersRef= db.ref('members/')
    membersRef.on('value', snapshot=> {
      const dbMembers= snapshot.val()
      if (dbMembers === null) {
        return null
      }
      else {
        const chats= Object.keys(dbMembers).filter(c=> {
           return Object.values(dbMembers[c]).includes(authedUser)
        })
        const otherIds= chats.map(i=> {
          const idArr= Object.values(dbMembers[i]).filter(i=> i !== authedUser)
          return idArr
        })
        this.setState(currState=> ({
          currState,
          convos: chats,
          otherUids: otherIds
        }), ()=> {this.getChatData()
                  this.getUsers()})
      }
    })
  }
  getChatData= ()=> {
    const { convos }= this.state
    const chatRef= db.ref(`chats/`)
    chatRef.on('value', snapshot=> {
      const dbChat= snapshot.val()
      const list= convos.map(c=> {
        return dbChat[c]
      })
      this.setState(currState=> ({
        currState,
        convosData: list,
      }), ()=> this.getMessages())
    })

  }
  getMessages= ()=> {
    const { convosData, convos }= this.state
    const messagesRef= db.ref('messages/')
    messagesRef.on('value', snapshot=> {
      const dbMessages= snapshot.val()
      const messagesList= convos.map((o, index)=> {
        return {
          message:dbMessages[o],
          index: index}
      })
      const orderedMessages= messagesList.sort((a,b)=> {
        return b.timeStamp - a.timeStamp
      })
      this.setState(currState=> ({
        currState,
        messagesData: orderedMessages,
      }))
    })
  }

  getUsers= ()=> {
    const { otherUids }= this.state
    const usersRef= db.ref('users/')
    usersRef.on('value', snapshot=> {
      const dbUsers= snapshot.val()
      const usersObjs= otherUids.map(id=> {
        return dbUsers[id]
      })
      this.setState(currState=> ({
        currState,
        uIds: usersObjs,
      }))
    })
  }


  renderItem=({item}, state)=> (
    <View style={{
        borderColor: 'black',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'}}>
      <Text> {state.uIds[item.index].displayName}</Text>
      <Text>{state.convosData[item.index].lastMessage}</Text>
    </View>
  )
  render() {
    const { authedUser, users }= this.props
    const { messagesData, uIds }= this.state
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          keyExtractor={item=> item.id}
          data={messagesData}
          renderItem={(item)=>this.renderItem(item, this.state)}
          style={{flex: 1, width: '100%'}}
         />
      </SafeAreaView>
    )
  }
}

const styles=StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 2,
    flex: 1,
    width: '100%',
  }
})

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(ExistingConvos)
