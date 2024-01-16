import { Card, CardBody } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import React from 'react'

const StatCard = (props) => {
  return (
    <div className="mr-2">
      <Card>
        <CardBody>
          <div className="flex flex-col justify-start items-start">
            {!props.link ? (
              <h4>{props.stat}</h4>
            ) : (
              <h4>
                <Link href={props.link} className="ml-2">
                  {props.stat}
                </Link>
              </h4>
            )}
            <p>{props.title}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default StatCard
