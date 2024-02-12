import { Card, CardBody } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import React from 'react'

const StatCard = ({ stat, title, link = false }) => {
  return (
    <div className="mr-2">
      <Card>
        <CardBody>
          <div className="flex flex-col justify-start items-start">
            {!link ? (
              <h4>{stat}</h4>
            ) : (
              <h4>
                <Link href={link} className="ml-2">
                  {stat}
                </Link>
              </h4>
            )}
            <p>{title}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default StatCard
