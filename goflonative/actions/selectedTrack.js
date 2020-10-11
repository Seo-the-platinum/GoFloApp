export const SET_SELECTED_TRACK= 'SET_SELECTED_TRACK'

export function setSelectedTrack(uri) {
  return {
    type: SET_SELECTED_TRACK,
    uri,
  }
}
