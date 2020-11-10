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

let _isMounted= false

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
     _isMounted= true
    if (_isMounted) {
      const { authedUser, users }= this.props
      if ( Constants.platform.ios) {
        const { status }= await ImagePicker.requestCameraRollPermissionsAsync()
        if ( status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work')
        }
      }
      console.log('within didMount', _isMounted)
      if ( users[authedUser].profilePic !== undefined ) {
        await this.getUri()
      } else {
        await this.getDefaultUri()
      }
    }
  }

  componentWillUnmount () {
    _isMounted= false
  }

  getUri= ()=> {
    console.log('start of getUri',_isMounted)
    const { authedUser, users }= this.props
    const fireSource= storageRef.child(`images/${users[authedUser].profilePic.imgName}`)
    return fireSource.getDownloadURL().then((url)=> {
      if ( _isMounted ) {
        this.setState(currState=> ({
          imgUri: url,
          loading: false,
          about: users[authedUser].artistAbout,
          artist: users[authedUser].artistName,
        }))
      }
    })
  }

  getDefaultUri= ()=> {
    const { authedUser, users }= this.props
    const fireSource= storageRef.child('images/defaultUserpic.jpg')
    return fireSource.getDownloadURL().then((url)=> {
      if (_isMounted) {
        this.setState(currState=> ({
          imgUri: url,
          loading: false,
          about: users[authedUser].artistAbout,
          artist: users[authedUser].artistName,
        }))
      }
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
          <View style={{flex: 1, padding: '2%', width: '75%'}}>
            <View style={styles.imgContainer}>
            <Image
              source={{uri:imgUri}}
              style={styles.img}
              resizeMode= 'contain'/>
              <View style={styles.imageButtonContainer}>
                <TouchableOpacity
                  title="Upload profile image"
                  onPress={this.pickImage}
                  style={styles.imageButton}>
                  <Text style={{
                    color: 'white'}}
                  > Upload Image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.midSec}>
              <View style={styles.artistAboutContainer}>
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
            </View>
            <View style={styles.bottomSec}>
              <View style={styles.artistInfluences}>
                <TextInput
                  maxLength={12}
                  onChangeText={text=> this.handleArtistInfluence1(text)}
                  placeholder='Enter musical influence'
                  placeholderTextColor= 'white'
                  style={styles.influence1}
                  value={influence1}/>
                <TextInput
                  maxLength={12}
                  onChangeText={text=> this.handleArtistInfluence2(text)}
                  placeholder='Enter musical influence'
                  placeholderTextColor= 'white'
                  style={styles.influence2}
                  value={influence2}/>
                <TextInput
                  maxLength={12}
                  onChangeText={text=> this.handleArtistInfluence3(text)}
                  placeholder='Enter musical influence'
                  placeholderTextColor= 'white'
                  style={styles.influence3}
                  value={influence3}/>
              </View>
              <View style= {styles.saveContainer}>
                <TouchableOpacity onPress={this.saveSettings}>
                  <Text style={styles.saveBtn}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    flex: .5,
    width: '80%',
  },

  artistAboutContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  artistInfluences: {
    alignItems: 'center',
    flex: 1,
  },

  artistInput: {
    color: 'white',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  aboutInput: {
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    height: '50%',
    marginTop: '4%',
    justifyContent: 'center',
    textAlign: 'left',
    width: '100%',
  },

  bottomSec: {
    flex: .5,
    justifyContent: 'flex-start',
  },

  container: {
    alignItems: 'center',
    backgroundColor: 'gray',
    flex: 1,
    width: '100%',
  },

  img: {
    height: '80%',
    width: '100%',
  },

  imgContainer: {
    alignItems: 'center',
    flex: .5,
  },

  imageButton: {
    alignItems: 'center',
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    height: '60%',
    justifyContent: 'center',
    width: '80%',
  },

  imageButtonContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  influence1: {
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: .25,
    height: '75%',
    margin: '2%',
    textAlign: 'center',
    width: '100%',
  },

  influence2: {
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: .25,
    height: '75%',
    margin: '2%',
    textAlign: 'center',
    width: '100%',
  },

  influence3: {
    backgroundColor: 'rgb(1, 125, 86)',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: .25,
    height: '75%',
    margin: '2%',
    textAlign: 'center',
    width: '100%',
  },

  midSec: {
    flex: .25,
    justifyContent: 'center',
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
    flex: .25,
    justifyContent: 'center',
    width: '100%',
  }
})

function mapStateToProps({ authedUser, users}) {
  return {
    authedUser,
    users,
  }
}
export default connect(mapStateToProps)(Customize)
