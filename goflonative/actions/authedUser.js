export const SET_AUTHED_USER= 'SET_AUTHED_USER'

export function setAuthedUser(username) {
  console.log(username)
  return {
    type: SET_AUTHED_USER,
    username,
  }
}
