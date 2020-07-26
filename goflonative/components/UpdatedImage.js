import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { connect } from 'react-redux'
import { storageRef } from '../utils/firebase'


const UpdatedImage= (props)=> {
    const [imgSrc, setUrl] = useState(undefined)
    const { authedUser, users }= props
    useFocusEffect(
      React.useCallback(()=> {
        let isActive= true
        const updateUrl= async ()=> {
          const fireSource= storageRef.child(`images/${users[authedUser].profilePic.imgName}`)
          return await fireSource.getDownloadURL().then((url)=> {
            if (isActive) {
              setUrl(url)
            }
          })
        }

        updateUrl()

        return ()=> isActive= false
      })
    )
  return (
    <View>
      {imgSrc !== undefined ?
        <Image
          source={{uri:imgSrc}}
          style={{width: 200, height: 200}}/>
        : null
      }
    </View>
  )
}

function mapStateToProps({authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(UpdatedImage)
