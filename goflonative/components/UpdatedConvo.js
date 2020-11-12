import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { db } from '../utils/firebase'
import { useFocusEffect } from '@react-navigation/native'


const UpdatedConvo= (props)=> {
  const [ messages, setMessages ]= useState([])
  const { authedUser, uid, chat, renderMessages }= props
  console.log('render', chat)
  useFocusEffect(
    React.useCallback(()=> {
    let isActive= true
    console.log('in useCallback', chat)
    if (chat !== undefined) {
      console.log('chat should be here', chat)
    const messagesRef= db.ref(`messages/${chat}`)
    const listener= messagesRef.on('value', snapshot=> {
      let dbMessages= snapshot.val()
      if (dbMessages !== null) {
        const orderedMessages= Object.keys(dbMessages).map(m=> {
          return dbMessages[m]
        }).sort((a,b)=> b.timeStamp - a.timeStamp)
        if (isActive) {
          setMessages(orderedMessages)
        }
      }
    })
    return ()=> messagesRef.off('value', listener)
  } else {
    const membersRef= db.ref(`members/`)
    const listener= membersRef.on('value', snapshot=> {
      let dbMembers= snapshot.val()
      if (dbMembers !== null) {
        const newChat= Object.keys(dbMembers).filter(c=> {
          const values= Object.values(dbMembers[c])
          if (values.includes(authedUser) && values.includes(uid)) {
            return dbMembers[c]
          }
        })
      const chatRef= db.ref(`messages/${chat}`)
      chatRef.on('value', snapshot=> {
        let dbMessages= snapshot.val()
        if (dbMessages !== null) {
          const sortedChat= Object.keys(dbMessages).map(m=> {
            return dbMessages[m]
          }).sort((a,b)=> b.timeStamp - a.timeStamp)
          if (isActive) {
            setMessages(sortedChat)
          }
        }
      })
      }
    })
    return ()=> membersRef.off('value', listener)
    }
  }, [chat]))
  console.log('checking after', messages, chat)
  return (
    <FlatList
      data={messages}
      inverted
      keyExtractor={(item)=> item.id}
      renderItem={renderMessages}
    />
  )
}

export default UpdatedConvo
