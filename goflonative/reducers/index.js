import { combineReducers } from 'redux'
import users from './users'
import authedUser from './authedUser'
import selectedTrack from './selectedTrack'

export default combineReducers({
  users,
  authedUser,
  selectedTrack,
})
