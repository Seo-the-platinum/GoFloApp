//temporary data file

let users= {
  wombraider: {
    artistName: 'The Pleasurables',
    artistAbout: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
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
    tracks: {
      track1: {
        genre: 'alt rock',
        producer: 'The Pleasurables',
        source: require('../assets/sounds/heavenandhell.mp3'),
        title: 'Heaven and Hell',
      },
      track2: {
        genre: 'alt rock',
        producer: 'The Pleasurables',
        source: require('../assets/sounds/whyyoumad.mp3'),
        title: 'Why You Mad',
      },
      track3: {
        genre: 'alt rock',
        producer: 'The Pleasurables',
        source: require('../assets/sounds/wherehaveyoubeen.mp3'),
        title: 'Where Have You Been',
      },
    },
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
