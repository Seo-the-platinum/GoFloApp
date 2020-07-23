import { RECEIVE_USERS, TOGGLE_STATUS, UPDATE_URL } from '../actions/users';

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
    default:
      return state
  }
}
