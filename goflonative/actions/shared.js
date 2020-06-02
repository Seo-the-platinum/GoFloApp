import { _getUsers } from '../utils/_DATA.js';
import { receiveUsers } from './users'
import { setAuthedUser } from './authedUser'

/*
  export default function handleInitialData() {
    return (dispatch)=> {
      return Promise.all([
         _getUsers(),
      ]).then(values=> {
        dispatch(receiveUsers(values[0]))
        dispatch(setAuthedUser)
      })
    }
  }
*/
export default function handleInitialData(data) {
  return (dispatch)=> {
      dispatch(receiveUsers(data))
      dispatch(setAuthedUser)
  }
}
