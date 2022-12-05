import React, { useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import AirportInfo from '../../Shared/Components/Airport/AirportInfo'
import AirportAircraft from '../../Shared/Components/Airport/AirportAircraft'
import AirportContracts from '../../Shared/Components/Airport/AirportContracts'

const AirportDetail = ({ airport, metar, aircraft, contracts }) => {
  const [activeTab, setActiveTab] = useState('airport')

  function handleTabChange (e) {
    const tab = e.target.id
    console.log(tab)
    setActiveTab(tab)
  }

  function renderContent () {
    let component
    switch (activeTab) {
      case 'airport':
        component = <AirportInfo airport={airport} metar={metar} />
        break
      case 'contracts':
        component = <AirportContracts contracts={contracts} />
        break
      case 'aircraft':
        component = <AirportAircraft aircraft={aircraft} />
        break
    }
    return component
  }

  return (
    <div>
      <h2>{airport.name} - {airport.identifier}</h2>
      <div className="tabs my-2">
        {/* eslint-disable-next-line react/no-string-refs */}
        <a onClick={(e) => handleTabChange(e)} id="airport" className={`${activeTab === 'airport' ? 'tab-active' : ''} tab tab-bordered`}>Airport Info</a>
        <a onClick={(e) => handleTabChange(e)} id="contracts" className={`${activeTab === 'contracts' ? 'tab-active' : ''} tab tab-bordered`}>Contracts</a>
        <a onClick={(e) => handleTabChange(e)} id="aircraft" className={`${activeTab === 'aircraft' ? 'tab-active' : ''} tab tab-bordered`}>Aircraft</a>
      </div>
      <div>
        {renderContent()}
      </div>

    </div>
  )
}

AirportDetail.layout = page => <AppLayout children={page} title="Airport Details" heading="Airport Details" />

export default AirportDetail
