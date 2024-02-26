import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { PlaneLanding, PlaneTakeoff } from 'lucide-react'
import React from 'react'

import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'

const CompletedContracts = ({ contracts }) => {
  return (
    <div className="p-4">
      <div className="mt-1">
        {contracts &&
          contracts.data.map((contract) => (
            <div key={contract.id} className="mt-1">
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center content-center">
                      <Icon as={PlaneTakeoff} />
                      <Link href={`/airports/${contract.dep_airport_id}`}>
                        {contract.dep_airport_id}
                      </Link>
                      <div className="text-sm">{contract.dep_airport.name}</div>
                    </div>
                    <div className="flex flex-col items-center content-center">
                      <Icon as={PlaneLanding} />
                      <Link href={`/airports/${contract.arr_airport_id}`}>
                        {contract.arr_airport_id}
                      </Link>
                      <div className="text-sm">{contract.arr_airport.name}</div>
                    </div>
                    <div className="flex flex-col items-center content-center">
                      <div>Distance</div>
                      {contract.distance.toLocaleString(navigator.language)}nm
                    </div>
                    <div className="flex flex-col items-center content-center">
                      <div>Cargo</div>
                      <div className="flex justify-start space-x-1">
                        <span></span>
                        <span>
                          {contract.cargo_qty}{' '}
                          {contract.cargo_type === 1 ? (
                            <span>lbs</span>
                          ) : (
                            <span>PAX</span>
                          )}
                        </span>
                        <span>{contract.cargo}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center content-center">
                      <div>Contract Value</div>$
                      {parseFloat(contract.contract_value).toLocaleString()}
                    </div>
                    <div className="flex flex-col items-center content-center">
                      <div>Completed Date</div>
                      {format(contract.completed_at, 'DD/MM/YYYY')}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
      </div>
      <div className="mt-2">
        <Pagination pages={contracts} />
      </div>
    </div>
  )
}

CompletedContracts.layout = (page) => (
  <AppLayout
    children={page}
    title="Completed Contracts"
    heading="Completed Contracts"
  />
)

export default CompletedContracts
