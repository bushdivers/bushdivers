import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Ranks = ({ ranks, awards }) => {
  return (
    <div>
      <PageTitle title="Ranks and Awards" />
      <div className="rounded shadow bg-white p-4 flex justify-between">
        <div className="w-1/2">
          <h2 className="text-xl mb-2">Ranks</h2>
          {ranks && (
            ranks.map((rank) => (
              <div key={rank.id} className="flex justify-start items-center mb-4">
                <img src={rank.image} width="100"/>
                <div className="ml-4">
                  <div className="text-lg font-bold">{rank.name}</div>
                  <span className="text-sm">Hours: {rank.hours}</span><br/>
                  <span className="text-sm">Points: {rank.points}</span><br/>
                  <span className="text-sm">Pay Rate: ${rank.pilot_pay}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-1/2">
          <h2 className="text-xl mb-2">Points</h2>
        </div>
      </div>
      <div className="rounded shadow bg-white p-4 mt-4">
        <h2 className="text-xl mb-4">Awards</h2>
        {awards && (
          awards.map((award) => (
            <div key={award.id} className="flex justify-start items-center mb-4">
              <img src={award.image} width="100"/>
              <div className="ml-4">
                <div className="text-lg font-bold">{award.name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

Ranks.layout = page => <Layout children={page} title="Ranks & Awards" />

export default Ranks
