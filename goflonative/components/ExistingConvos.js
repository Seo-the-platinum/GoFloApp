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
    itemsList: null,
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
          if (dbMembers[i].member1 === authedUser) {
            return dbMembers[i].member2
          } else {
            return dbMembers[i].member1
          }
        })

        this.setState(currState=> ({
          currState,
          convos: chats,
          otherUids: otherIds
        }), ()=> this.getChatData()
        )
      }
    })
  }

  componentWillUnmount() {
    const membersRef= db.ref('members/')
    const chatRef= db.ref('chats/')
    const messagesRef= db.ref('/messages')
    const usersRef= db.ref('/users')

    membersRef.off()
    chatRef.off()
    messagesRef.off()
    usersRef.off()
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
      const messagesList= convos.map(o=> {
        return dbMessages[o]
      })
      const orderedMessages= messagesList.sort((a,b)=> {
        return b.timeStamp - a.timeStamp
      })
      this.setState(currState=> ({
        currState,
        messagesData: orderedMessages,
      }), ()=> this.getUsers())
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
      }), ()=> this.buildObj())
    })
  }

  buildObj= async ()=> {
    const { convosData, messagesData, uIds, convos }= this.state
    const promises= convosData.map((c, index)=> {
      const displayName= uIds[index].displayName
      const url= uIds[index].profilePic.imgName
      const txt= c.lastMessage
      const uid= uIds[index].uid
      const chat= convos[index]
      const fireSource= storageRef.child(`images/${url}`)
      return fireSource.getDownloadURL().then(url => {
        return {
          displayName,
          trueUrl: url,
          uid,
          txt,
          chat,
        }
      })
    })
    await Promise.all(promises).then((res)=> {
      this.setState(currState=> ({
        currState,
        itemsList: res,
      }))
    })
  }

  toMessage=(item)=> {
    const { navigation }= this.props
    navigation.navigate('Conversation', {
      uid: item.uid,
      name: item.displayName,
      url: item.trueUrl,
      chat: item.chat,
    })
  }

  renderItem=({item})=> (
    <TouchableOpacity
      onPress={()=> this.toMessage(item)}
      style={styles.itemContainer}>
      <View style={styles.imgContainer}>
        <Image
          source={{uri: item.trueUrl}}
          style={styles.thumbImg}
        />
      </View>
      <View style={styles.textView}>
        <Text
          style={styles.itemDisplayName}
         >
          {item.displayName}
        </Text>
        <Text
          style={styles.itemTxt}>
           {item.txt}
        </Text>
      </View>
    </TouchableOpacity>
  )
  render() {
    const { authedUser, users }= this.props
    const { itemsList, doneLoading }= this.state
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          keyExtractor={(item)=> {return item.uid}}
          data={itemsList}
          renderItem={(item)=> this.renderItem(item)}
          style={{flex: 1, width: '100%'}}
         />
      </SafeAreaView>
    )
  }
}

const styles=StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },

  imgContainer: {
    alignItems: 'flex-end',
    marginBottom: '2%',
    marginRight: '5%',
    width: '15%',
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  itemDisplayName: {
    fontSize: 24,
  },

  itemTxt: {
    fontSize: 12,
  },

  textView: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },

  thumbImg: {
    borderRadius: 40,
    height: 50,
    width: 50,
  },
})

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(ExistingConvos)
