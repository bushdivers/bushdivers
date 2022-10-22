import React from 'react'
import { Link } from '@inertiajs/inertia-react'
import Card from './Card'

const StatCard = (props) => {
  return (
    <div className="mr-2">
      <Card>
        <div className="flex flex-col justify-start items-start">
        { !props.link
          ? <h4>{props.stat}</h4>
          : <h4><Link href={props.link} className="ml-2 btn">{props.stat}</Link></h4>
        }
      <p>{props.title}</p>
        </div>
      </Card>
    </div>
  )
}

export default StatCard
