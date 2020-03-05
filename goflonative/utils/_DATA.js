//temporary data file

let users= {
  wombraider: {
    follows:['DeCepT1oN', 'CARNAG3', 'BOO BOT'],
    followers:['DeCepT1oN', 'CARNAG3', 'BOO BOT'],
    password: 'fastSwimmers89',
    profilePic: 'images/newbieCloud.jpg',
    rankedBattles: {
      wins: 100,
      loses:0,
    },
    status: 'offline',
    userName: 'wombraider',

  },
  DeCepT1oN: {
    follows:['wombraider', 'CARNAG3', 'BOO BOT'],
    followers:['wombraider', 'CARNAG3', 'BOO BOT'],
    password: 'goflonominal',
    profilePic: 'images/masterChief.jpg',
    rankedBattles: {
      wins: 0,
      loses: 100,
    },
    status: 'offline',
    userName: 'DeCepT1oN',
  },
  CARNAG3: {
    follows:['wombraider', 'DeCepT1oN', 'BOO BOT'],
    followers:['wombraider', 'DeCepT1oN', 'BOO BOT'],
    password: 'seosbrisbest',
    profilePic: 'images/carnageProfile.jpg',
    rankedBattles: {
      wins: 0,
      loses: 100,
    },
    status: 'offline',
    userName: 'CARNAG3',
  },
}

export function _getUsers() {
  return new Promise ((res,rej)=> {
    setTimeout(()=> res({...users}), 1000)
  })
}
