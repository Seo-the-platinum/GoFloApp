import React, { Component } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { storageRef, db } from '../utils/firebase'
import * as FileSystem from 'expo-file-system'

class UploadVox extends Component {
  state= {
    title: '',
  }

  handleInput= (title)=> {
    console.log(this.props)
    this.setState(currState=> ({
      title: title,
    }))
  }

  uploadVoxFile= async ()=> {
    const { title }= this.state
    const { uri }= this.props.route.params
    const trackName= `${title}.${uri.split('.').pop()}`
    const request= await fetch(uri)
    const blob= await request.blob()
    const locRef= storageRef.child(`sounds/${trackName}`)
    await locRef.put(blob)
    this.updateRecordings(trackName)
    await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'AV')
    
  }


  updateRecordings= async (trackName)=> {
    const { authedUser }= this.props
    const { selectedTrack }= this.props.route.params
      await db.ref(`users/${authedUser}/recordings`).update({
        selectedTrack,
        trackName,
      })
  }


  render() {
    const { title }= this.state
    const { selectedTrack }= this.props.route.params
    return (
      <View>
        <Text>
          {`recorded with ${selectedTrack}`}
        </Text>
        <TextInput
          placeholder='recording title'
          onChangeText={ (title)=> this.handleInput(title)}
          defaultValue={title}/>
        <Button
          title='upload'
          onPress={this.uploadVoxFile}/>
      </View>
    )
  }
}
function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(UploadVox)
