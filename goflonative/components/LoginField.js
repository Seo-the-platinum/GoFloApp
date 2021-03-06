import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import handleInitialData from '../actions/shared'
import { setAuthedUser } from '../actions/authedUser'
import { toggleStatus } from '../actions/users'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../utils/firebase'

let usersRef= db.ref('users/')
class LoginField extends Component {
  state={
    username: '',
    password:'',
    match: true,
    redirect: false,
  }

  componentDidMount() {
    usersRef.on('value', snapshot=> {
      let data= snapshot.val()
      this.props.dispatch(handleInitialData(data))
    })
  }

  handleUser= text => {
    this.setState(currState =>({
      currState,
      username: text,
    }))
  }

  handlePassword= text => {
    this.setState(currState =>({
      currState,
      password: text,
    }))
  }

  signIn= ()=> {
    const { username, password, redirect, match }= this.state
    const { dispatch }= this.props
    auth.signInWithEmailAndPassword(username, password)
    .then(()=> { dispatch(setAuthedUser(auth.currentUser.uid))
      db.ref().child('/users/' + auth.currentUser.uid ).update({
        online: true,
      })
    })
    .catch((error)=> {
      console.log(error.code, error.message)
      this.setState(currState=> ({
        currState,
        match: false,
      }))
    })

  }


  render() {
    const { username, password, match }=this.state
    return (
      <View style={ styles.container}>
        <Text style={styles.label}> USER NAME</Text>
        <TextInput
          style={styles.userName}
          value={username}
          onChangeText={(text)=> this.handleUser(text)}
        />
        <Text style={styles.label}> PASSWORD </Text>
        <TextInput
          style={styles.passWord}
          secureTextEntry={true}
          value={password}
          onChangeText={(text)=> this.handlePassword(text)}
        />
        { match === false ?
          <Text style={styles.invalid}>Username or Password is incorrect</Text>
        :null}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={this.signIn}
        >
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: '25%',
    justifyContent: 'flex-end',
    textAlign: 'left',
    width: '95%',
  },
  invalid: {
    color: 'red',
  },
  label: {
    color: 'gray',
  },
  loginButton: {
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    height: '15%',
    marginTop: 30,
    width: '100%',
  },
  loginText: {
    color: 'gray',
  },
  passWord: {
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    height: '15%',
    marginTop: 10,
    width: '100%',
  },
  userName: {
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    height: '15%',
    marginBottom: 10,
    width: '100%',
  },
})

function mapStateToProps({ users }) {
  return {
    users
  }
}

export default connect(mapStateToProps)(LoginField)
