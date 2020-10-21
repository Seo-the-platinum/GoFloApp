import React, { Component } from 'react'
import {
  Button,
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
    influence1:null,
    influence2:null,
    influence3:null,
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
/*
  handleDisplayName= (text)=> {
    this.setState(currState=> ({
      currState,
      display: text,
    }))
  }
*/
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
    //this.setDisplayName(display)
    this.setArtistName(artist)
    this.setArtistAbout(about)
    this.setArtistsInfluences()
  }

  setProfilePic= async (imgName)=> {
    const { authedUser, dispatch, users }= this.props
    await db.ref(`users/${authedUser}/profilePic`).update({
     imgName,
     }, ()=> dispatch(updateProfilePic(authedUser, imgName)))
   }
/*
  setDisplayName= async (display)=> {
    const { authedUser, dispatch, users }= this.props
    const user= auth.currentUser
    await user.updateProfile({
      displayName: display,
    }).then(()=> console.log(`display name has been update to ${display}`))
    .catch((error)=> console.log('setDisplayName error:',error))
  }
*/
  setArtistName= async (artist)=> {
    const { authedUser, dispatch, users }= this.props
    await db.ref(`users/${authedUser}/`).update({
      artistName: artist,
    }, ()=> dispatch(updateArtist(authedUser, artist)))
  }

  setArtistAbout= async (artistAbout)=> {
    const { authedUser, dispatch }= this.props
    await db.ref(`users/${authedUser}/`).update({
      artistAbout: artistAbout,
    }, ()=> dispatch(updateArtistAbout(authedUser, artistAbout)))
  }

  setArtistsInfluences= async ()=> {
    const { authedUser, dispatch }= this.props
    const { influence1, influence2, influence3 }= this.state
    await db.ref(`users/${authedUser}/favoriteArtist/`).update({
      0:influence1,
      1:influence2,
      2:influence3,
    })
  }

  handleArtistInfluence1= (text)=> {
    const { influence1 }= this.state
    this.setState(currState=> ({
      currState,
      influence1: text,
    }))
  }
  handleArtistInfluence2= (text)=> {
    const { influence2 }= this.state
    this.setState(currState=> ({
      currState,
      influence2: text,
    }))
  }
  handleArtistInfluence3= (text)=> {
    const { influence3 }= this.state
    this.setState(currState=> ({
      currState,
      influence3: text,
    }))
  }
  render() {
    const {
      about,
      artist,
      display,
      imgUri,
      influence1,
      influence2,
      influence3,
      loading, }= this.state
    if ( loading === false ) {
    return (
      <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding': 'height'}
        style={styles.container}>
        <View>
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
        <View style={styles.artistInfluences}>
          <TextInput
            maxLength={20}
            onChangeText={text=> this.handleArtistInfluence1(text)}
            placeholder='Enter musical influence...'
            placeholderTextColor= 'white'
            style={styles.influence1}
            value={influence1}/>
          <TextInput
            maxLength={20}
            onChangeText={text=> this.handleArtistInfluence2(text)}
            placeholder='Enter musical influence...'
            placeholderTextColor= 'white'
            style={styles.influence2}
            value={influence2}/>
          <TextInput
            maxLength={20}
            onChangeText={text=> this.handleArtistInfluence3(text)}
            placeholder='Enter musical influence...'
            placeholderTextColor= 'white'
            style={styles.influence3}
            value={influence3}/>
        </View>
        </View>
        <View style= {styles.saveContainer}>
          <TouchableOpacity onPress={this.saveSettings}>
            <Text style={styles.saveBtn}>
              Save
            </Text>
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
  artistInfluences: {
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

  influence1: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },

  influence2: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },

  influence3: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    height: '75%',
    textAlign: 'center',
    width: '100%',
  },
  saveBtn: {
    color: 'white',
    fontSize: 18,
  },

  saveContainer: {
    alignItems: 'center',
    backgroundColor: 'rgb(0, 110, 64)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    height: '5%',
    justifyContent: 'center',
    width: '50%',
  }
})

function mapStateToProps({ authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Customize)
