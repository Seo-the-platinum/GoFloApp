import React, { Component } from 'react'
import { FlatList,
         Image,
         Platform,
         SafeAreaView,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View } from 'react-native'
import { connect } from 'react-redux'
import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements'
import { storageRef, db } from '../utils/firebase'

class FindFriends extends Component {
  state={
    search: '',
    filteredData: [],
    data: [],
  }

 componentDidMount () {
    this.retrieveUrls()
  }

  retrieveUrls= async ()=> {
    const { users }= this.props
    const usersList= Object.keys(users)
    const promises= usersList.map((u,index)=> {
      const fireSource= storageRef.child(`images/${users[u].profilePic.imgName}`)
      return fireSource.getDownloadURL().then(url=> {
        return {
          ...users[u],
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

  updateSearch=(search)=> {
    this.setState(currState=>({
      currState,
      search,
    }), ()=> this.filterLogic())
  }

  filterLogic= ()=> {
    const { data, filteredData, search }= this.state
    const { authedUser, users }= this.props
    if (search.length < 1) {
      this.setState(currState=> ({
        currState,
        filteredData: [],
      }))
    } else {
    const usersFilter= data.filter(u=> {
      if (u.displayName !== undefined && u.displayName.toUpperCase() !== users[authedUser].displayName.toUpperCase()) {
      return u.displayName.toUpperCase().includes(search.toUpperCase())
    } else {
      null
    }
  })
  this.setState(currState=> ({
    ...currState,
    filteredData: usersFilter,
    }))
  }
}

requestFriend= async (item)=> {
  const { authedUser, users }= this.props
  const sender= users[authedUser].uid
  const recepient= users[item.uid].uid
  await db.ref(`users/${item.uid}/`).update({
    recievedRequest: [sender],
    }
  )
  await db.ref(`users/${authedUser}/`).update({
    sentRequest: [recepient],
    }
  )
}

  renderItem=({item})=> (
      <TouchableOpacity
        style={styles.itemView}
        key={item.displayName}>
        <Image
          source={{uri: item.trueUrl}}
          style={styles.thumbImg}
          />
          <Text style={{fontSize: 36}}>
            {item.displayName}
          </Text>
        <TouchableOpacity onPress={()=>this.requestFriend(item)}>
          <AntDesign name="adduser" size={36} color="black"/>
        </TouchableOpacity>
      </TouchableOpacity>
  )

  render() {
    const { search, filteredData }= this.state
    return (
      <View style={styles.container}>
        <SearchBar
          containerStyle={{
            backgroundColor: 'rgba(0, 117, 88, .7)',
          }}
          onChangeText={this.updateSearch}
          placeholder='Type Here...'
          platform={Platform.OS === 'ios' ? 'ios': 'android'}
          value={search}/>
        <SafeAreaView style={{width: '95%'}}>
        <FlatList
          style={{width: '95%'}}
          data={filteredData}
          renderItem={this.renderItem}
          keyExtractor={item=> item.index.toString() }
        />
        </SafeAreaView>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    height: '10%',
    marginTop: '20%',
    paddingLeft: '1%',
    paddingRight: '1%',
  },
itemView: {
  alignItems: 'flex-end',
  borderColor: 'white',
  borderWidth: 1,
  flex:1,
  flexDirection: 'row',
  justifyContent: 'space-between',
},

  thumbImg: {
    borderRadius: 40,
    height: 50,
    width: 50,
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(FindFriends)
