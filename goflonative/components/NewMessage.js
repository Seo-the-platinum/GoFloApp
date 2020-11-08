import React, { Component } from 'react'
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { db, storageRef } from '../utils/firebase'
import Conversation from './Conversation'

class NewMessage extends Component {
  state= {
    data: [],
    filteredData: [],
    search:null,
  }

  updateSearch= (text)=> {
    const { search }= this.state
    this.setState(currState=> ({
      currState,
      search: text,
    }), ()=> this.filterSearch())
  }

  filterSearch=()=> {
    const { data, filteredData, search }= this.state
    const { users }= this.props
    if ( search.length < 1) {
      this.setState(currState=> ({
        currState,
        data: [],
        filteredData: [],
      }))
    } else {
      const usersList= Object.keys(users)
      const usersFilter= usersList.filter(u=> {
        const { displayName }= users[u]
        if (displayName !== undefined) {
        return displayName.toUpperCase().includes(search.toUpperCase())

        } else {
          return;
        }
      })
      this.setState(currState=>({
        currState,
        data: usersFilter,
      }), ()=> this.debounce(this.retrieveUrls(this.state.data), 250))
    }
  }

  retrieveUrls= async (uidArr)=> {
    const { authedUser, users }= this.props
    const promises =uidArr.map(uid=> {
      const fireSource= storageRef.child(`images/${users[uid].profilePic.imgName}`)
      return fireSource.getDownloadURL().then(url=> {
        return {
          ...users[uid],
          trueUrl: url,
        }
      })
    })
    await Promise.all(promises).then(res=> {
      this.setState(currState=> ({
        ...currState,
        filteredData: res,
      }), ()=> {
        this.state.search.length < 1 ? (
          this.setState(currState=> ({
            ...currState,
            filteredData: [],
          }))
        ): null
      })
    })
  }

  debounce= function (fn, wait) {
    let t
    return ()=>   {
      clearTimeout(t)
      t= setTimeout(() => fn.apply(this, arguments), wait)
    }
  }

  toMessage= (item)=> {
    const { authedUser, navigation, users }= this.props
    console.log('authedUser and uid', authedUser, item.uid)
    let memberRef= db.ref(`members/`)
    memberRef.on('value', snapshot=> {
      let dbMembers= snapshot.val()
      if (dbMembers === null) {
        navigation.navigate('Conversation', {
          uid: item.uid,
          name: users[item.uid].displayName,
          url: item.trueUrl,
        })
      }
      else {
        const chat= Object.keys(dbMembers).filter(c=> {
          const keyList= Object.values(dbMembers[c])
          if (keyList.includes(authedUser) && keyList.includes(item.uid)){
            return c
          }
        })
        console.log('chat here after map', chat)
        if (chat[0] !== undefined) {
          navigation.navigate('Conversation', {
            uid: item.uid,
            name: users[item.uid].displayName,
            url: item.trueUrl,
            chat: chat,
          })
        } else {
          navigation.navigate('Conversation', {
            uid: item.uid,
            name: users[item.uid].displayName,
            url: item.trueUrl,
          })
        }
      }
    })
  }

  renderItem= ({item})=> (
      <TouchableOpacity
        onPress={()=>this.toMessage(item)}
        style={styles.itemView}>
        <Image
          source={{uri: item.trueUrl}}
          style={styles.thumbImg}
        />
        <Text>
          { item.displayName}
        </Text>
      </TouchableOpacity>
  )

  render() {
    const { search, filteredData }= this.state
    console.log('filteredData here', filteredData)
    return (
      <View>
        <SearchBar
          containerStyle= {{
            backgroundColor: 'rgba(0, 82, 50, .9)',
          }}
          value={search}
          onChangeText={this.updateSearch}
          platform={Platform.OS === 'ios' ? 'ios': 'android'}
        />
        <FlatList
          data={filteredData}
          renderItem={this.renderItem}
          keyExtractor={item=> item.uid.toString()}
        />
      </View>
    )
  }
}

styles=StyleSheet.create({
  itemView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  thumbImg: {
    borderRadius: 40,
    height: 50,
    width: 50,
  }
})

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(NewMessage)
