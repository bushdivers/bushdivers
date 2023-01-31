import React from 'react'
import Card from '../../Elements/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

function AirportMetar ({ metar, loading, isRunwayVisible }) {
  return (
    <div className={`absolute top-44 z-10 ${isRunwayVisible ? 'left-72' : 'left-12'}`}>
      <Card slimline>
        {loading
          ? (<FontAwesomeIcon icon={faCircleNotch} spin />)
          : (
            <>
              {metar
                ? (
                  <span>{ metar }</span>
                  )
                : (
                  <span>No METAR available</span>
                  )
              }
            </>
            )
        }
      </Card>
    </div>
  )
}

export default AirportMetar
