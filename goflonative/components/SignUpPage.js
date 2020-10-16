import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View } from 'react-native'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'
import { auth, db } from '../utils/firebase'
import { connect } from 'react-redux'
import { setAuthedUser } from '../actions/authedUser'

class SignUpPage extends Component {
  state={
    email:'',
    password:'',
    confirmPassword:'',
    userName:'',
    taken: false,
  }

  handleUser=(text)=> {
    const { email }= this.state
    this.setState(currState=> ({
      email: text,
    }))
  }

  handlePassword=(text)=> {
    const { password }= this.state
    this.setState(currState=> ({
      password: text,
    }))
  }

  handleConfirm=(text)=> {
    const { confirmPassword }= this.state
    this.setState(currState=> ({
      confirmPassword: text,
    }))
  }

  handleUserName=(text)=> {
    const { userName }= this.state
    this.setState(currState=> ({
      currState,
      userName: text,
    }))
  }

  signUp= async ()=> {
    const { email, password, confirmPassword, userName }= this.state
    const { users }= this.props
    const usersList= Object.keys(users)
    const userNamesList= usersList.map((u)=> users[u].displayName.toUpperCase())

    if ( password === confirmPassword && !userNamesList.includes(userName.toUpperCase())) {
      auth.createUserWithEmailAndPassword(email, password)
      .then(()=> auth.currentUser.updateProfile({displayName: userName}))
      .then(()=> this.addUserToDb(auth.currentUser.uid))
      .catch(error=> {
        if(error.code === 'auth/email-already-exists') {
          console.log('That email is already in use!')
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid')
        }
        console.log(error)
      })
    } else {
      this.setState(currState=> ({
        currState,
        taken: true,
      }))
    }
  }

  addUserToDb= async (userId)=> {
    const { dispatch }= this.props
    const { userName }= this.state
    console.log('here is the UID', userId)
    await db.ref('users/' + userId).set({
      artistAbout: 'Tell us about you...',
      artistName: 'Artist or Group name here...',
      displayName: userName,
      favoriteArtist: ['Artist1', 'Artist2', 'Artist3'],
      online: false,
      profilePic: {
        imgName: 'defaultUserpic.jpg',
      },
      tracks: {
        sampleTrack: {
          genre: 'hip hop',
          producer: 'Ben Paul',
          source: 'sounds/Minx.mp3',
          title: 'Minx',
        },
      },
    })
  }
  render() {
    const { email,
            password,
            confirmPassword,
            userName,
            taken, }= this.state

    return (
      <View style={styles.container}>
        <View style={styles.inputArea}>
          <View style={styles.emailArea}>
            <TextInput
              style={styles.email}
              value={email}
              onChangeText={(text)=> this.handleUser(text)}/>
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}>
              <MaterialIcons name='email' size={24} color='white'/>
              <Text style={{color: 'white', flex: 1, fontSize: 24}}> Email</Text>
            </View>
          </View>
          <View style={styles.passwordArea}>
            <TextInput
              style={styles.password}
              value={password}
              onChangeText={(text)=> this.handlePassword(text)}
              secureTextEntry={true}/>
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}>
              <Entypo name='key' size={24} color='white'/>
              <Text style={{color: 'white', flex: 1, fontSize: 24}}> Password</Text>
            </View>
          </View>
          <View style={styles.confirmPasswordArea}>
            <TextInput
              style={styles.confirmPassword}
              value={confirmPassword}
              onChangeText={(text)=> this.handleConfirm(text)}
              secureTextEntry={true}/>
            <Text style={{color: 'white', flex: 2, fontSize: 24, }}>
              Confirm Password
            </Text>
          </View>
          <View style={styles.userNameArea}>
            <TextInput
              style={styles.userName}
              value={userName}
              onChangeText={(text)=> this.handleUserName(text)}
            />
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}>
              <AntDesign name='user' size={24} color='white'/>
              <Text style={{color: 'white', flex: 1, fontSize: 24}}> Username</Text>
              {taken ? <Text style={{color: 'red'}}>
                Username is already taken, please try another userName
                </Text>: null}
            </View>
          </View>
            <TouchableOpacity
              onPress={this.signUp}
              style={styles.signUp}>
              <Text style={{
                color: 'white', fontSize: 24
              }}
                >sign up
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  confirmPassword: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: 1,
  },

  confirmPasswordArea: {
    flex: 1,
  },

  container: {
    alignItems: 'center',
    backgroundColor: 'gray',
    flex: 1,
    justifyContent: 'center',
  },

  inputArea: {
    height: '45%',
    flexDirection: 'column',
    width: '85%',
  },
  password: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: 1,
    fontSize: 18,
  },
  passwordArea: {
    flex: 1,
  },

  signUp: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgb(0, 117, 105)',
    height: '15%',
    justifyContent: 'center',
    padding: 5,
    width: '25%',
  },

  email: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: 1,
    fontSize: 18,
  },

  emailArea: {
    flex: 1,
  },

  userName: {
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    color: 'white',
    flex: 1,
    fontSize: 18,
  },

  userNameArea: {
    flex: 1,
  }
})

function mapStateToProps({users}) {
  return {
    users,
  }
}
export default connect(mapStateToProps)(SignUpPage)
