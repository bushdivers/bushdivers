import { atom } from 'jotai'

export const contractFiltersAtom = atom({
  distance: 0,
  payload: 0,
})

export const selectedContractAtom = atom(null)
