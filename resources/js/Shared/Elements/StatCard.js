import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const StatCard = (props) => {
  return (
    <div className="rounded shadow bg-white p-4 mr-2 text-center">
        { !props.link
          ? <div className="text-2xl">{props.stat}</div>
          : <div className="text-2xl"><Link href={props.link} className="ml-2 btn">{props.stat}</Link></div>
        }
      <div className="text-sm">{props.title}</div>
    </div>
  )
}

export default StatCard
