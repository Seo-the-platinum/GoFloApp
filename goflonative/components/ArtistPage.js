import React, { Component } from 'react'
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View } from 'react-native'
import { connect } from 'react-redux'

class ArtistPage extends Component {
  render() {
    const { authedUser, users }= this.props
    console.log(`here is the artist data ${users[authedUser].artistName}`)
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={{
            color: 'white',
            fontSize: 36,}}> Artist Page</Text>
        </View>
        <View style={styles.artistHeader}>
          <View style={styles.artistTitle}>
            <ImageBackground
              source={require('../assets/spitBAck.png')}
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                width: '100%',
                }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 24,}}
              >{ users[authedUser].artistName }
              </Text>
            </ImageBackground>
          </View>
          <View style={styles.artistImage}>
            <Image
              style={{
                width:'100%',
                height:'100%',}}
              source={require('../assets/pleasurables.jpg')}
            />
          </View>
        </View>
        <View style={styles.aboutMe}>
          <Text style={{
            color: 'white',
            fontSize: 18,
          fontWeight: 'bold',}}>
            ABOUT ME
          </Text>
          < ScrollView>
            <Text style={{
              color: 'white',
              fontSize: 18}}>
              {users[authedUser].artistAbout}
            </Text>
          </ScrollView>
        </View>
        <View style={{
            borderColor: 'white',
            boroderTopWidth: 2,
            borderBottomWidth: 2,
            flex: 1}}>
          <Text>
            Favorite MC'S:
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text>
            Favorite Sub-Genre:
          </Text>
        </View>
        <View style={{
            flex: 1}}>
          <Image
            source={require('../assets/SPIT_Grid_bars.png')}
            style={{flex: 1}}/>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({

  artistHeader: {
    flex: 1,
    flexDirection: 'row',
  },
  artistImage: {
    flex: 1,
  },
  artistTitle: {
    flex: 2,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'gray',
    flex: 1,
  },
  headerView: {
    alignItems: 'center',
    backgroundColor: 'black',
    height: '10%',
    justifyContent: 'flex-end',
  },
  aboutMe: {
    backgroundColor: '#454545',
    borderColor: 'white',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    flex: 1,
    padding: '5%',
  }
})

function mapStateToProps({users, authedUser}) {
  return {
    users,
    authedUser,
  }
}
export default connect(mapStateToProps)(ArtistPage)
