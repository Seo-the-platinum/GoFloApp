import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View } from 'react-native'
import { connect } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import { auth, db, storageRef } from '../utils/firebase'
import Profile from './Profile'
import {
  updateProfilePic,
  updateArtist,
  updateArtistAbout } from '../actions/users'

const DismissKeyboard= ({ children })=> (
  <TouchableWithoutFeedback
    onPress={()=> Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class Customize extends Component {

  state= {
    about: null,
    artist: null,
    imgUri: null,
    loading: true,
    display: null,
  }

  async componentDidMount() {
    const { authedUser, users }= this.props
    if ( Constants.platform.ios) {
      const { status }= await ImagePicker.requestCameraRollPermissionsAsync()
      if ( status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work')
      }
    }
    if ( users[authedUser].profilePic !== undefined ) {
      await this.getUri()
    } else {
      await this.getDefaultUri()
    }
  }

  getUri= ()=> {
    const { authedUser, users }= this.props
    const fireSource= storageRef.child(`images/${users[authedUser].profilePic.imgName}`)
    return fireSource.getDownloadURL().then((url)=> {
      this.setState(currState=> ({
        imgUri: url,
        loading: false,
        about: users[authedUser].artistAbout,
        artist: users[authedUser].artistName,
      }), ()=> console.log('users img', url))
    })
  }

  getDefaultUri= ()=> {
    const { authedUser, users }= this.props
    const fireSource= storageRef.child('images/defaultUserpic.jpg')
    return fireSource.getDownloadURL().then((url)=> {
      this.setState(currState=> ({
        imgUri: url,
        loading: false,
        about: users[authedUser].artistAbout,
        artist: users[authedUser].artistName,
      }))
    })
  }


  pickImage= async ()=> {
    let result= await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })

    this.setState(currState=> ({
      currState,
      imgUri: result.uri,
    }))
  }

  handleDisplayName= (text)=> {
    this.setState(currState=> ({
      currState,
      display: text,
    }))
  }

  handleArtistName= (text)=> {
    this.setState(currState=> ({
      currState,
      artist: text,
    }))
  }

  handleAbout= (text)=> {
    this.setState(currState=> ({
      currState,
      about: text,
    }))
  }

  saveSettings= async ()=> {
    const { about, artist, display, imgUri }= this.state
    const { authedUser, users }= this.props
    const imgName= `${imgUri.split('/').pop()}`
    const request= await fetch(imgUri)
    const blob= await request.blob()
    const locRef= storageRef.child(`images/${imgName}`)
     if (users[authedUser].profilePic !== undefined) {
      const oldImgName= users[authedUser].profilePic.imgName
      const delRef= storageRef.child(`images/${oldImgName}`)
      if (oldImgName !== 'defaultUserpic.jpg') {
      await delRef.delete().then(()=> locRef.put(blob))
      } else {
        await locRef.put(blob)
      }
    } else {
      await locRef.put(blob)
    }
    this.setProfilePic(imgName)
    this.setDisplayName(display)
    this.setArtistName(artist)
    this.setArtistAbout(about)
  }

  setProfilePic= async (imgName)=> {
    const { authedUser, dispatch, users }= this.props
    await db.ref(`users/${authedUser}/profilePic`).update({
     imgName,
     }, ()=> dispatch(updateProfilePic(authedUser, imgName)))
   }

  setDisplayName= async (display)=> {
    const { authedUser, dispatch, users }= this.props
    const user= auth.currentUser
    await user.updateProfile({
      displayName: display,
    }).then(()=> console.log(`display name has been update to ${display}`))
    .catch((error)=> console.log('setDisplayName error:',error))
  }

  setArtistName= async (artist)=> {
    const { authedUser, dispatch, users }= this.props
    await db.ref(`users/${authedUser}/`).update({
      artistName: artist,
    }, ()=> dispatch(updateArtist(authedUser, artist)))
  }

  setArtistAbout= async (artistAbout)=> {
    const { authedUser, dispatch, users }= this.props
    await db.ref(`users/${authedUser}/`).update({
      artistAbout: artistAbout,
    }, ()=> dispatch(updateArtistAbout(authedUser, artistAbout)))
  }

  render() {
    const { about, artist, display, imgUri, loading, }= this.state
    if ( loading === false ) {
    return (
      <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding': 'height'}
        style={styles.container}>
        <View style={styles.imageButtonContainer}>
        <Image
          source={{uri:imgUri}}
          style={styles.img}/>
          <TouchableOpacity
            title="Upload profile image"
            onPress={this.pickImage}
            style={styles.imageButton}>
            <Text style={{color: 'white'}}> Upload Image </Text>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          accessible={false}
          onPress={Keyboard.dismiss}>
        <View style={styles.displayNameContainer}>
          <TextInput
            maxLength={20}
            onChangeText={(text)=>this.handleDisplayName(text)}
            placeholder='Enter Display Name'
            placeholderTextColor= 'white'
            value={display}
            style={styles.displayNameInput}
          />
        </View>
        </TouchableWithoutFeedback>

        <View style={styles.artistContainer}>
          <TextInput
            maxLength={20}
            onChangeText= {(text)=>this.handleArtistName(text)}
            placeholder='Enter Artist Name'
            placeholderTextColor= 'white'
            value={artist}
            style={styles.artistInput}
          />
        </View>
        <View style={styles.artistAboutContainer}>
          <TextInput
            maxLength={200}
            multiline={true}
            onChangeText= {(text)=>this.handleAbout(text)}
            placeholder='Enter About'
            placeholderTextColor= 'white'
            value={about}
            style={styles.aboutInput}
          />
        </View>
        <View>
          <TouchableOpacity onPress={this.saveSettings}>
            <Text> Save </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  } else {
    return (
      null
    )
  }
  }
}

styles= StyleSheet.create({
  artistContainer: {
    alignItems: 'center',
    height: '10%',
    width: '50%',
  },

  artistAboutContainer: {
    alignItems: 'center',
    height: '10%',
    width: '50%',
  },

  artistInput: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },

  aboutInput: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },

  container: {
    backgroundColor: 'gray',
    flex: 1,
    justifyContent: 'flex-start',
  },

  displayNameContainer: {
    alignItems: 'center',
    height: '10%',
    marginTop: '5%',
    width: '50%',
  },

  displayNameInput: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },

  header: {
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  img: {
    width: '50%',
    height: '75%',
  },

  imageButton: {
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    height: '17%',
    justifyContent: 'center',
    width: '50%',
  },

  imageButtonContainer: {
    height: '35%',
    justifyContent: 'space-between',
    width: '100%',
  },
})

function mapStateToProps({ authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Customize)
