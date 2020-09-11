export const RECEIVE_USERS= 'RECEIVE_USERS'
export const TOGGLE_STATUS= 'TOGGLE_STATUS'
export const UPDATE_URL=  'UPDATE_URL'
export const UPDATE_ARTIST= 'UPDATE_ARTIST'

export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users,
  }
}

export function toggleStatus(user) {
  return {
    type: TOGGLE_STATUS,
    user
  }
}

export function updateProfilePic(authedUser,imgName) {
  return {
    type: UPDATE_URL,
    authedUser,
    imgName,
  }
}

export function updateArtist(authedUser, artist) {
  return {
    type: UPDATE_ARTIST,
    authedUser,
    artist,
  }
}
