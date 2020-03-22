export const RECEIVE_USERS= 'RECEIVE_USERS'
export const TOGGLE_STATUS= 'TOGGLE_STATUS'

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
