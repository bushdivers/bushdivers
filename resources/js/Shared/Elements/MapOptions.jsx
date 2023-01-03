import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faEarthEurope, faMountainSun, faSatellite } from '@fortawesome/free-solid-svg-icons'
import Tooltip from './Tooltip'

export default function MapOptions ({ updateMap, currentStyle }) {
  return (
    <div className="absolute z-10 top-28 right-12">
      <div className="flex space-x-1">
        <Tooltip direction="bottom" content="Terrain">
          <button onClick={() => updateMap('terrain')} className={`btn ${currentStyle === 'terrain' ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faMountainSun} /></button>
        </Tooltip>
        <Tooltip direction="bottom" content="Satellite">
          <button onClick={() => updateMap('satellite')} className={`btn ${currentStyle === 'satellite' ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faSatellite} /></button>
        </Tooltip>
        <Tooltip direction="bottom" content="Current Theme">
          <button onClick={() => updateMap('')} className={`btn ${currentStyle === '' ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faEarthEurope} /></button>
        </Tooltip>
      </div>
    </div>
  )
}
