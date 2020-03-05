import { SET_AUTHED_USER } from '../actions/authedUser'

export default function authedUser(state=null, action) {
  switch(action.type) {
    case SET_AUTHED_USER:
      const { username }= action
      return username
    default:
      return state;
  }
}
