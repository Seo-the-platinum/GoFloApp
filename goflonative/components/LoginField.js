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
  import { useNavigation } from '@react-navigation/native'


class LoginField extends Component {
  state={
    username: '',
    password:'',
    match: true,
    redirect: false,
  }

  componentDidMount() {
    this.props.dispatch(handleInitialData())
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

  submit= ()=> {
    const { users, dispatch }= this.props
    const { username, password, match }= this.state
    const usersArray= Object.keys(users)
    const pwArray= usersArray.map(u=> users[u].password)

    usersArray.indexOf(username) !== -1 && pwArray.indexOf(password) !==-1 ?
    this.setState(currState=> ({
      currState,
      match: true,
      username: '',
      password: '',
      redirect: true,
    }), ()=> dispatch(setAuthedUser(username)))
    :
    this.setState(currState=> ({
      currState,
      match: false,
      username: '',
      password: '',
    }))
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
          onPress={()=> {this.submit()
           {this.state.redirect ? this.props.navigation.navigate('Loading')
           :null}}}
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
