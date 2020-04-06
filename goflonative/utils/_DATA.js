//temporary data file

let users= {
  wombraider: {
    artistName: 'The Pleasurables',
    artistAbout: `An alt rock/ alt punk band based out of Los Angeles.`,
    favoriteArtist: ['Blink182','Arctic Monkeys','The Strokes'],
    follows:['DeCepT1oN', 'CARNAG3'],
    followers:['DeCepT1oN', 'CARNAG3'],
    password: 'fastSwimmers89',
    profilePic: require('../assets/newbieCloud.jpg'),
    rankedBattles: {
      wins: 100,
      loses:0,
    },
    online: false,
    tracks: [
      '../assets/sounds/The_Pleasurables-Heaven&Hell.mp3',
    ],
    userName: 'wombraider',
  },
  DeCepT1oN: {
    follows:['wombraider', 'CARNAG3'],
    followers:['wombraider', 'CARNAG3'],
    password: 'goflonominal',
    profilePic: require('../assets/masterChief.jpg'),
    rankedBattles: {
      wins: 0,
      loses: 100,
    },
    online: false,
    userName: 'DeCepT1oN',
  },
  CARNAG3: {
    follows:['wombraider', 'DeCepT1oN'],
    followers:['wombraider', 'DeCepT1oN'],
    password: 'seosbrisbest',
    profilePic: require('../assets/carnageProfile.jpg'),
    rankedBattles: {
      wins: 0,
      loses: 100,
    },
    online: false,
    userName: 'CARNAG3',
  },
}

export function _getUsers() {
  return new Promise ((res,rej)=> {
    setTimeout(()=> res({...users}), 1000)
  })
}
