import { RECEIVE_USERS, TOGGLE_STATUS } from '../actions/users';

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
    console.log(user)
    return {
      ...state,
      [user]: {
        ...state[user],
        online: !state[user].online,
      }
    }
    default:
      return state
  }
}
