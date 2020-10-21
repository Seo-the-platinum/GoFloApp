import React, { Component } from 'react'
import { FlatList,
         Image,
         SafeAreaView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View } from 'react-native'
import { connect } from 'react-redux'
import { storageRef } from '../utils/firebase'

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

  handleAccept= (item)=> {
    console.log(item)
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
          style={styles.accOrDecBtn}>
          <Text style={{color: 'white'}}> Accept </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accOrDecBtn}>
          <Text style={{color: 'white'}}> Decline </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  render() {
    const { data }= this.state
    return (
      <View style={styles.container}>
        <Text>
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
        <View>
          <Text>
          </Text>
        </View><View>
          <Text>
          </Text>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1,
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

  thumbImg: {
    borderRadius: 40,
    height: 40,
    width: 40,
  },

  accOrDecBtn: {
    alignItems: 'center',
    backgroundColor: 'rgb(0, 117, 88)',
    flex: 1,
    height: '70%',
    justifyContent: 'center',
    margin: '1%',
    width: '20%'
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    authedUser,
    users,
  }
}

export default connect(mapStateToProps)(Messages)
