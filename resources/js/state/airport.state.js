import { atom } from 'jotai'

export const PANELSTATE = {
  WEATHER: 'weather',
  FUEL: 'fuel',
  FILTERS: 'filters',
  LAYERS: 'layers',
}
export const selectedMapPanelAtom = atom('')
