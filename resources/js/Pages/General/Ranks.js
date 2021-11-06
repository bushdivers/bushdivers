import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Ranks = ({ ranks, awards }) => {
  return (
    <div>
      <PageTitle title="Ranks and Awards" />
      <div className="rounded shadow bg-white p-4 mt-4">
          <h2 className="text-xl mb-2">Ranks</h2>
          {ranks && (
            ranks.map((rank) => (
              <div key={rank.id} className="flex justify-start items-center mb-4">
                <img src={rank.image} width="100"/>
                <div className="ml-4">
                  <div className="text-lg font-bold">{rank.name}</div>
                  <span className="text-sm">Hours: {rank.hours}</span><br/>
                  <span className="text-sm">Points: {rank.points}</span><br/>
                </div>
              </div>
            ))
          )}
      </div>
      <div className="rounded shadow bg-white p-4 mt-4">
        <h2 className="text-xl mb-4">Points</h2>
        <div className="mb-4">
          <div className="font-bold">Completed flight:</div>
          <div className="text-sm">5 Points</div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Per 50nm flown:</div>
          <div className="text-sm">2 Points</div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Return aircraft to home:</div>
          <div className="text-sm">5 Points</div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Landing rate:</div>
          <div className="text-sm">Below 0fpm: -2 Points</div>
          <div className="text-sm">0fpm to 2fpm: -1 Point</div>
          <div className="text-sm">3fpm to 39fpm: 1 Point</div>
          <div className="text-sm">40fpm to 59fpm: 3 Points</div>
          <div className="text-sm">60fpm: 50 Points</div>
          <div className="text-sm">61fpm to 180fpm: 5 Points</div>
          <div className="text-sm">181fpm to 400fpm: 1 Point</div>
          <div className="text-sm">Over 400fpm: -2 Points</div>
        </div>
      </div>
      <div className="rounded shadow bg-white p-4 mt-4">
        <h2 id="awards" className="text-xl mb-4">Awards</h2>
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
