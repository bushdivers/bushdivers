import React from 'react'
import Card from '../../Elements/Card'

function AirportMetar ({ metar, isRunwayVisible }) {
  return (
    <div className={`absolute top-44 z-10 ${isRunwayVisible ? 'left-72' : 'left-12'}`}>
      <Card slimline>
      {metar
        ? (
            <span>{ metar }</span>
          )
        : (
           <span>No METAR available</span>
          )
      }
      </Card>
    </div>
  )
}

export default AirportMetar
