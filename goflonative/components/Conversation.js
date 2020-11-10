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

let _isMounted= false

class Conversation extends Component {
  state={
    str: '',
    ids: null,
    height: 200,
    chronoOrder: [],
  }

  componentDidMount() {
    _isMounted= true
    const { authedUser, users }= this.props
    const { chat, uid }= this.props.route.params
    console.log('chat here in did mount', chat)
    if (chat !== undefined) {
      let messagesRef= db.ref('messages/' + chat)
      messagesRef.on('value', snapshot=> {
        if (snapshot === null) {
          return null
        } else {
          let dbMessages= snapshot.val()
          if ( dbMessages !== null) {
            const messageList= Object.keys(dbMessages).map(m=> {
              return dbMessages[m]
            })
            const chronolized= messageList.sort((a,b)=> {
              return b.timeStamp - a.timeStamp
            })
            this.setState(currState=> ({
              currState,
              chronoOrder: chronolized,
            }))
          }
        }
      })
    }
  }

  componentWillUnmount() {
    _isMounted= false
    const { chat }= this.props.route.params
    let messagesRef= db.ref(`/messages/${chat}`)
    messagesRef.off()
  }

  updateSize= (height)=> {
    this.setState(currState=> ({
      currState,
      height,
    }))
  }

  sendMessage=()=> {
    const{ authedUser, users }= this.props
    const { chat, uid }= this.props.route.params
    const data= this.createMessage()
    if ( chat === undefined ) {
      const newChat= `${users[authedUser].displayName}&${users[uid].displayName}`

      db.ref('chats/' + newChat).set({
        lastMessage: data.text,
        timeStamp: data.timeStamp,
        mId: data.id,
      })

      db.ref('members/' + newChat).set({
        member1: authedUser,
        member2: uid,
      })

      db.ref('messages/' + newChat + '/' + data.id).set(
        data
      )
    }
    else {
    db.ref(`messages/${chat}/${data.id}`).set(
       data
    )
    db.ref(`chats/${chat}`).set({
      lastMessage: data.text,
      timeStamp: data.timeStamp,
      mId: data.id,
    })
    db.ref(`members/${chat}`).set({
      member1: authedUser,
      member2: uid,
    })
    }

    this.setState(currState=> ({
      currState,
      str: ''
    }))
  }

  setTime= (initTime)=> {
    const time= new Date(initTime)
    const hours= time.getHours()
    const mins= time.getMinutes()
    if (hours >= 12 && mins < 10) {
      return `${hours-12}: 0${mins} Pm`
    }
    else if (hours >= 12) {
      return `${hours -12}: ${mins}Pm`
    }
    else if (mins < 10) {
      return `${hours}: 0${mins}Am`
    }
    else {
      return `${hours}:${mins}Am`
    }
  }

  createMessage= ()=> {
    const { str }= this.state
    const { authedUser, users }= this.props
    const initTime= Date.now()
    return {
      author: users[authedUser].uid,
      id: this.idGenerator(),
      timeStamp: initTime,
      displayTime: this.setTime(initTime),
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
      <View style={[styles.textContainer,
        item.author === this.props.route.params.uid ? styles.textContainer:
        styles.sentTextContainer]}>
        <Text style={styles.textStyle}> {item.text}</Text>
      </View>
      <View>
        <Text style={{color: 'white'}}>{item.displayTime}</Text>
      </View>
    </View>
  )

  render() {
    const { displayName, authedUser }= this.props
    const { name, url, uid }= this.props.route.params
    const { chronoOrder, str }= this.state
    let height= this.state.height
    return (
      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding': 'height'}
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <SafeAreaView style={styles.messageThread}>
          <View style={{flex: 1}}>
            <FlatList
              data={chronoOrder}
              renderItem={this.renderMessages}
              keyExtractor={item=> item.id}
              inverted
            />
          </View>
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
              value={str}
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
    backgroundColor: 'rgb(53, 75, 79)',
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
    backgroundColor: 'rgb(53, 75, 79)',
    flex: 5,
  },

  receivedContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-end',
    margin: '2%',
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
    flex: 1,
    justifyContent: 'flex-end',
    margin: '2%',
  },

  sentTextContainer: {
    alignItems: 'flex-end',
    backgroundColor:'rgb(0, 117, 88)',
    borderColor:'rgb(1, 145, 81)',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'flex-end',
    margin: '1%',
    maxWidth: '50%',
    textAlign: 'right',
  },

  textContainer: {
    backgroundColor:'rgb(0, 96, 99)',
    borderColor:'rgb(0, 143, 148)',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'flex-end',
    margin: '1%',
    maxWidth: '50%',
    textAlign: 'left',
  },
  textStyle: {
    color: 'white',
    padding: 10,
  },

  textInput: {
    color: 'white',
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
