const { atom } = require("recoil");

export const playlistState = atom({
  key: "playlistAtomState",
  default: null
})

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '3CLAGNDHoFph6xzXTyTBE6'
})