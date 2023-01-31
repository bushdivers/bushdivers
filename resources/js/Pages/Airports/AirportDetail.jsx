import React, { useState, useEffect, useContext } from 'react'
import AppLayout from '../../Shared/AppLayout'
// import AirportInfo from '../../Shared/Components/Airport/AirportInfo'
// import AirportAircraft from '../../Shared/Components/Airport/AirportAircraft'
// import AirportContracts from '../../Shared/Components/Airport/AirportContracts'
import AirportMap from '../../Shared/Components/Airport/AirportMap'
import MapOptions from '../../Shared/Elements/MapOptions'
import ThemeContext from '../../Context/ThemeContext'
import axios from 'axios'

const metarKey = import.meta.env.VITE_METAR
const metarUrl = 'https://api.checkwx.com/metar'

const fetchDirectMetar = async (icao) => {
  const res = await axios.get(
    `${metarUrl}/${icao}`,
    {
      headers: {
        'X-API-KEY': metarKey
      }
    }
  )
  if (res.data.results !== 1) {
    return await fetchNearestMetar(icao)
  } else {
    return res.data.data.join()
  }
}

const fetchNearestMetar = async (icao) => {
  const res = await axios.get(
    `${metarUrl}/${icao}/nearest`,
    {
      headers: {
        'X-API-KEY': metarKey
      }
    }
  )
  return res.data.data.join()
}

const AirportDetail = ({ airport, aircraft, contracts }) => {
  const { currentTheme } = useContext(ThemeContext)
  const [currentMapStyle, setCurrentMapStyle] = useState('')
  const [metar, setMetar] = useState('')
  const [metarLoading, setMetarLoading] = useState(false)

  useEffect(() => {
    setCurrentMapStyle('')
  }, [currentTheme])

  useEffect(() => {
    // const getMetar = async () => {
    //   const res = await fetchDirectMetar(airport.identifier)
    //   setMetar(res)
    // }
    // setMetarLoading(true)
    // console.log(airport)
    // getMetar()
    // setMetarLoading(false)
    setMetar('')
    setMetarLoading(false)
  }, [airport])

  return (
    <div className="relative">
      <AirportMap airport={airport} metar={metar} metarLoading={metarLoading} aircraft={aircraft} contracts={contracts} size="full" updatedMapStyle={currentMapStyle} />
      <MapOptions updateMap={setCurrentMapStyle} currentStyle={currentMapStyle} />
    </div>
  )
}

AirportDetail.layout = page => <AppLayout children={page} title="Airport Details" heading="Airport Details" fullSize />

export default AirportDetail
