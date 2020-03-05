import { RECEIVE_USERS } from '../actions/users';

export default function users(state={}, action) {
  switch(action.type) {
    case RECEIVE_USERS:
    const { users }= action
    return {
      ...state,
      ...users,
    }
    default:
      return state
  }
}
