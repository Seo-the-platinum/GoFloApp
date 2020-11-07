import React, { Component } from 'react'
import { FlatList,
         Image,
         SafeAreaView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View } from 'react-native'
import { connect } from 'react-redux'
import { db, storageRef } from '../utils/firebase'
import { Entypo } from '@expo/vector-icons'
import NewMessage from './NewMessage'
import ExistingConvos from './ExistingConvos'

class Messages extends Component {
  state={
    data: [],
  }

  componentDidMount() {
    this.setData()
  }

  setData= async ()=> {
    const { authedUser, users }= this.props
    const { data }= this.state
    if ( users[authedUser].recievedRequest !== undefined) {
    const requestList= Object.keys(users[authedUser].recievedRequest)
    const promises= requestList.map((r, index)=> {
      const fireSource= storageRef.child(`images/${users[users[authedUser].recievedRequest[r]].profilePic.imgName}`)
      return fireSource.getDownloadURL().then(url=>{
        return {
          ...users[users[authedUser].recievedRequest[r]],
          index,
          trueUrl: url,
        }
      })
    })
    await Promise.all(promises).then((res)=> {
      this.setState(currState=> ({
        currState,
        data: res,
      }))
    })
  }
}

  handleAccept= async (item)=> {
    const { authedUser, users }= this.props
    await db.ref(`users/${authedUser}`).update({
      friends: [item.uid],
    })
    await db.ref(`users/${item.uid}`).update({
      friends: [users[authedUser].uid],
    })
    await db.ref(`users/${authedUser}/recievedRequest/${item.index}`).remove()
    await db.ref(`users/${item.uid}/sentRequest/${item.index}`).remove()

    this.setState(currState=> ({
      currState,
      data: this.state.data.filter(i => i !== item)
    }))
  }

  handleDecline= async (item)=> {
    const { authedUser }= this.props
    await db.ref(`users/${item.uid}/sentRequest/${item.index}`).remove()
    await db.ref(`users/${authedUser}/recievedRequest/${item.index}`).remove()
    this.setState(currState=> ({
      currState,
      data: this.state.data.filter(i => i !== item)
    }))
  }

  toNewMessage=()=> {
    const { navigation }= this.props
    navigation.navigate('NewMessage')
  }

  renderItem= ({item})=> (
    <View style={styles.itemContainer}>
      <Image
        source={{uri: item.trueUrl}}
        style={styles.thumbImg}
      />
      <View style={{flex: 1}}>
        <Text style={{marginLeft: '5%'}}>
          Friend request from {item.displayName}
        </Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={()=> this.handleAccept(item)}
          style={styles.accOrDecBtn}>
          <Text style={{color: 'white'}}> Accept </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> this.handleDecline(item)}
          style={styles.accOrDecBtn}>
          <Text style={{color: 'white'}}> Decline </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  render() {
    const { data }= this.state
    const { authedUser, users }= this.props
    return (
      <View style={styles.container}>
        <View style={styles.friendRequestView}>
          <Text style={styles.header}>
            Friend Requests
          </Text>
          <SafeAreaView style={{width: '97%'}}>
            <FlatList
              data={data}
              keyExtractor={item=> item.index.toString()}
              renderItem={this.renderItem}
              style={{width: '100%'}}
            />
          </SafeAreaView>
        </View>
        <View style={styles.messagesView}>
          <View style={styles.messagesHeader}>
            <View style={{
              alignItems: 'center',
              width: '85%'}}>
              <Text style={styles.header}>
                Messages
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={this.toNewMessage}>
                <Entypo
                  name="new-message"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            height: '100%',
            width: '100%'}}>
            <ExistingConvos navigation={this.props.navigation}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({

  accOrDecBtn: {
    alignItems: 'center',
    backgroundColor: 'rgb(0, 117, 88)',
    flex: 1,
    height: '70%',
    justifyContent: 'center',
    margin: '1%',
    width: '20%'
  },

  container: {
    alignItems: 'center',
    backgroundColor:'rgb(53, 75, 79)',
    flex: 1,
  },

  friendRequestView: {
    alignItems: 'center',
    width: '100%',
  },

  header: {
    fontSize: 36,
  },

  itemContainer: {
    alignItems: 'center',
    backgroundColor: 'gray',
    borderColor: 'black',
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    padding: '1%',
  },

  messagesHeader: {
    alignItems: 'flex-end',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  messagesView: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '5%',
    width: '100%',
  },

  thumbImg: {
    borderRadius: 40,
    height: 40,
    width: 40,
  },

})

function mapStateToProps({users, authedUser}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(Messages)
