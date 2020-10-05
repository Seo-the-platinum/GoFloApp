import {
  RECEIVE_USERS,
  TOGGLE_STATUS,
  UPDATE_URL,
  UPDATE_ARTIST,
  UPDATE_ARTIST_ABOUT, } from '../actions/users';

export default function users(state={}, action) {
  switch(action.type) {
    case RECEIVE_USERS:
      const { users }= action
      return {
        ...state,
        ...users,
      }
    case TOGGLE_STATUS:
      const { user }= action
      return {
        ...state,
        [user]: {
          ...state[user],
          online: !state[user].online,
        }
      }
    case UPDATE_URL:
      const { authedUser, imgName }= action
      return {
        ...state,
        [authedUser]: {
          ...state[authedUser],
          profilePic: {
            ...state[authedUser].profilePic,
            imgName: imgName,
          }
        }
      }
    case UPDATE_ARTIST:
      const { artist }= action
      return {
        ...state,
        [action.authedUser]: {
          ...state[action.authedUser],
          artistName: artist,
        }
      }
    case UPDATE_ARTIST_ABOUT:
      const { artistAbout }= action
      return {
        ...state,
        [action.authedUser]: {
          ...state[action.authedUser],
          artistAbout: artistAbout,
        }
      }
    default:
      return state
  }
}
