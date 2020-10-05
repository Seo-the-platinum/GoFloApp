import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import * as MediaLibrary from 'expo-media-library'

class MediaButton extends Component {
  _mediaLibraryAsync= async ()=> {
    const { status }= await MediaLibrary.requestPermissionsAsync()
    const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,

});
    console.log(media)
  }
  render() {
    return (
      <View>
        <Button
          onPress={this._mediaLibraryAsync}
          title='upload audio'/>
      </View>
    )
  }
}

const style= StyleSheet.create({
  btnStyles: {
    borderColor: 'green',
    borderWidth: 1,
  }
})
export default MediaButton
