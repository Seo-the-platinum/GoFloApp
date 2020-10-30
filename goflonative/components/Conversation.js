import React, { Component } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { db } from '../utils/firebase'
import { connect } from 'react-redux'
import { Feather } from '@expo/vector-icons';

class Conversation extends Component {
  state={
    str: '',
    messages: null,
    ids: null,
    height: 400,
    amOrPm: 'AM',
    messageTime: null,
    timeStamp: null,
    filteredMessages:[],
    chronoOrder: [],
  }

  componentDidMount() {
    const { authedUser, users }= this.props
    const { uid }= this.props.route.params
    let messagesRef= db.ref('messages/')
    messagesRef.on('value', snapshot=> {
      if (snapshot === null) {
        return null
      } else {
        let dbMessages= snapshot.val()
        if ( dbMessages !== null) {
        const filteredMessages= Object.keys(dbMessages).filter(m=> {
          return (
            (dbMessages[m].author === authedUser || dbMessages[m].author === uid) &&
          (dbMessages[m].recepient === authedUser || dbMessages[m].recepient === uid)
          )
        })
        this.setState(currState=> ({
          currState,
          messages: dbMessages,
          ids: filteredMessages,
        }), ()=> this.buildMessages()
          )
        }
      }
    })
  }


buildMessages= ()=> {
    const { ids, messages }= this.state
    const loop= ids.map(id=> {
      return messages[id]
    })
    this.setState(currState=> ({
      currState,
      filteredMessages: loop,
    }), ()=>this.chronoMessages())
}
chronoMessages= ()=> {
  const { filteredMessages }= this.state
  console.log('filteredMessages', filteredMessages)
  const chronoList=filteredMessages.sort((a,b)=> {
    return a.timeStamp - b.timeStamp
  })
  console.log('chronoList',chronoList)
  this.setState(currState=> ({
    currState,
    chronoOrder: chronoList,
  }), ()=> console.log('heres the order',this.state.chronoOrder))
}

  updateSize= (height)=> {
    this.setState(currState=> ({
      currState,
      height,
    }))
  }

  sendMessage=()=> {
    const { messages }= this.state
    const{ authedUser, users }= this.props
    const data= this.createMessage()
    db.ref('messages/' + data.id).set(
       data
    )
    db.ref('users/'+ users[authedUser].uid+'/messages/sent/'+ data.id).set(
      data.id
    )
    db.ref('users/' + data.recepient + '/messages/received' + data.id).set(
      data.id
    )
  }

  createMessage= ()=> {
    const { str, timeStamp }= this.state
    const { authedUser, users }= this.props
    return {
      author: users[authedUser].uid,
      id: this.idGenerator(),
      timeStamp: Date.now(),
      displayTime: this.timeStampGenerator(),
      recepient: this.props.route.params.uid,
      text: str,
    }
  }

  idGenerator= ()=> {
    const S4= ()=> {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
  }

  timeStampGenerator= ()=> {
    const time= new Date(Date.now())
    const secs= time.getSeconds()
    const mins= ()=> {
      if (time.getMinutes() < 10) {
        return `0${time.getMinutes()}`
      } else {
        return time.getMinutes()
      }
    }
    const hrs= ()=> {
      if (time.getHours() > 12) {
        this.setState(currState=> ({
          currState,
          amOrPm: 'PM',
        }))
        return time.getHours() -12
      } else {
          this.setState(currState=> ({
            currState,
            amOrPm: 'AM',
          }))
        return time.getHours()
      }
    }
    return `${hrs()}:${mins()}${this.state.amOrPm}`
  }

  handleText= (text)=> {
    const { str }= this.state
    this.setState(currState=> ({
      str: text,
    }))
  }

  renderMessages=({item})=> (
    <View style={[
      styles.sentContainer,
      item.author === this.props.route.params.uid ? styles.receivedContainer:
      styles.sentContainer]}>
      <Text> {item.text}</Text>
      <Text>{item.displayTime}</Text>
    </View>
  )

  render() {
    const { displayName, authedUser }= this.props
    const { name, url, uid }= this.props.route.params
    const { filteredMessages }= this.state
    let height= this.state.height

    return (
      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding': 'height'}
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <SafeAreaView style={styles.messageThread}>
          <FlatList
            data={filteredMessages}
            renderItem={this.renderMessages}
            keyExtractor={item=> item.id}
          />
        </SafeAreaView>
        <View style={{
          flex: .5,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '100%'}}
        >
          <View style={{
              alignItems: 'center',
              borderColor: 'black',
              borderRadius: 40,
              borderWidth: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: '2%',
              minHeight: height,
              width: '75%',
          }}>
            <TextInput
              onChangeText={this.handleText}
              multiline
              onContentSizeChange={(e)=> this.updateSize(e.nativeEvent.contentSize.height)}
              style={styles.textInput}
             />
             <TouchableOpacity
               onPress={this.sendMessage}
               style={styles.sendBtn}
             >
               <Feather name="send" size={24} color="black" />
             </TouchableOpacity>
          </View>
       </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  composeMessageView: {
    borderColor: 'black',
    borderRadius: 40,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: '2%',
    maxHeight: '100%',
    width: '75%',
  },

  messageThread: {
    borderColor: 'red',
    borderWidth: 1,
    flex: 5,
  },

  receivedContainer: {
    alignItems: 'flex-start',
    borderColor: 'green',
    borderWidth: 1,
    justifyContent: 'flex-start',
    height: '100%',
  },

  sendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0, 117, 88)',
    borderRadius: 80,
    height: '75%',
    width: '15%',
    marginBottom: '2%',
    marginRight: '1%',
  },

  sentContainer: {
    alignItems: 'flex-end',
    borderColor: 'green',
    borderWidth: 1,
    justifyContent: 'flex-end',
    height: '100%',
  },

  textInput: {
    height: '100%',
    width: '75%',
  }
})

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Conversation)
