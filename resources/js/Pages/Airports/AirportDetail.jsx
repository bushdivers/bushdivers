import React, { useState, useEffect, useContext } from 'react'
import AppLayout from '../../Shared/AppLayout'
// import AirportInfo from '../../Shared/Components/Airport/AirportInfo'
// import AirportAircraft from '../../Shared/Components/Airport/AirportAircraft'
// import AirportContracts from '../../Shared/Components/Airport/AirportContracts'
import AirportMap from '../../Shared/Components/Airport/AirportMap'
import MapOptions from '../../Shared/Elements/MapOptions'
import ThemeContext from '../../Context/ThemeContext'

const AirportDetail = ({ airport, metar, aircraft, contracts }) => {
  const { currentTheme } = useContext(ThemeContext)
  const [currentMapStyle, setCurrentMapStyle] = useState('')

  useEffect(() => {
    setCurrentMapStyle('')
  }, [currentTheme])

  return (
    <div className="relative">
      <AirportMap airport={airport} metar={metar} aircraft={aircraft} contracts={contracts} size="full" updatedMapStyle={currentMapStyle} />
      <MapOptions updateMap={setCurrentMapStyle} currentStyle={currentMapStyle} />
    </div>
  )
}

AirportDetail.layout = page => <AppLayout children={page} title="Airport Details" heading="Airport Details" fullSize />

export default AirportDetail
