import { SET_SELECTED_TRACK } from '../actions/selectedTrack'

export default function selectedTrack(state=null, action) {
  switch(action.type) {
    case SET_SELECTED_TRACK:
      const { uri }= action
      return uri
    default:
      return state;
  }
}
