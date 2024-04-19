import { atom } from 'jotai'

/**
 * Controls contract/airport map layer visibility.
 */
export const contractMapLayersAtom = atom({
  contracts: true,
  myContracts: false,
  sharedContracts: false,
  fleet: false,
  myAircraft: false,
})

/**
 * Controls contract/airport map style.
 */
export const contractMapStyleAtom = atom('default')

/**
 * Controls contract/airport map panel state.
 */
export const PANELSTATE = {
  WEATHER: 'weather',
  FUEL: 'fuel',
  FILTERS: 'filters',
  LAYERS: 'layers',
}

/**
 * Controls contract/airport map panel visibility.
 */
export const selectedMapPanelAtom = atom('')
