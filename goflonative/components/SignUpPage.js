import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View } from 'react-native'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'
import { auth } from '../utils/firebase'

class SignUpPage extends Component {
  state={
    email:'',
    password:'',
    confirmPassword:'',
    userName:'',
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

  signUp= ()=> {
    const { email, password, confirmPassword, userName }= this.state
    console.log(userName)
    if ( password === confirmPassword ) {
      auth.createUserWithEmailAndPassword(email, password)
      .then(()=> auth.currentUser.updateProfile({displayName: userName}))
      .catch(error=> {
        if(error.code === 'auth/email-already-exists') {
          console.log('That email is already in use!')
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid')
        }
        console.log(error)
      })

    }
  }
  render() {
    const { email, password, confirmPassword, userName }= this.state

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
          <View style={styles.userNameArea}>
            <TextInput
              style={styles.userName}
              value={userName}
              onChangeText={(text)=> this.handleUserName(text)}
            />
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}>
              <AntDesign name='user' size={24} color='white'/>
              <Text style={{color: 'white', flex: 1, fontSize: 24}}> Username</Text>
            </View>
          </View>
          <View style={styles.confirmPasswordArea}>
            <TextInput
              style={styles.confirmPassword}
              value={confirmPassword}
              onChangeText={(text)=> this.handleConfirm(text)}
              secureTextEntry={true}/>
            <Text style={{color: 'white', flex: 2, fontSize: 24, }}> Confirm Password</Text>
          </View>
            <TouchableOpacity
              onPress={this.signUp}
              style={styles.signUp}>
              <Text style={{color: 'white', fontSize: 24}}>sign up</Text>
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
    backgroundColor: 'rgb(17, 173, 59)',
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

export default SignUpPage
