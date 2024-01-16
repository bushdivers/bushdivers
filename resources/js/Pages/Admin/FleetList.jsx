import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import { Pen, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import FleetAircraft from '../../components/admin/FleetAircraft'
import NoContent from '../../components/elements/NoContent'
import AppLayout from '../../components/layout/AppLayout'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no fleet</div>
    </>
  )
}

const FleetList = ({ fleet }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  const handleDelete = (id) => {
    const accept = window.confirm('Are you sure you wish to delete this fleet?')
    if (!accept) return

    router.delete(`/admin/fleet/delete/${id}`)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <div className="flex justify-between">
                {fleet && fleet.length > 0 && (
                  <button
                    onClick={toggleDetail}
                    className="btn btn-secondary m-2"
                  >
                    Toggle fleet aircraft details
                  </button>
                )}
                <div className="inline m-2">
                  <Link
                    href="/admin/fleet/create"
                    className="btn btn-secondary mr-2"
                  >
                    Add new fleet
                  </Link>
                  <Link
                    href="/admin/aircraft/create"
                    className="btn btn-secondary"
                  >
                    Add new aircraft
                  </Link>
                </div>
              </div>
              {!fleet && <NoContent content={<EmptyData />} />}
              {
                fleet && fleet.length > 0 && (
                  // (
                  <div>
                    <table className="table table-compact w-full">
                      <thead>
                        <tr className="">
                          <th>Id</th>
                          <th>Type</th>
                          <th>Manufacturer</th>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>VA Fleet</th>
                          <th>Can Rent</th>
                          <td>Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {fleet &&
                          fleet.map((f) => (
                            <>
                              <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.type}</td>
                                <td>{f.manufacturer}</td>
                                <td>{f.name}</td>
                                <td>{f.aircraft.length}</td>
                                <td>{f.company_fleet ? 'Yes' : 'No'}</td>
                                <td>{f.is_rental ? 'Yes' : 'No'}</td>
                                <td>
                                  <div className="flex items-center">
                                    <Link
                                      href={`/admin/fleet/edit/${f.id}`}
                                      className="btn btn-secondary flex items-center mr-2"
                                    >
                                      <Icon as={Pen} />
                                    </Link>
                                    <Link
                                      href={`/admin/aircraft/create?fleet=${f.id}`}
                                      className="btn btn-light flex items-center mr-2"
                                    >
                                      <Icon as={Plus} />
                                    </Link>
                                    {f.aircraft.length === 0 && (
                                      <Link
                                        onClick={() => handleDelete(f.id)}
                                        className="btn btn-light flex items-center mr-2"
                                      >
                                        <Icon as={Trash2} />
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {showDetail && <FleetAircraft fleet={f} />}
                            </>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )
                // )
              }
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

FleetList.layout = (page) => (
  <AppLayout children={page} title="Admin - Fleet" heading="Fleet List" />
)

export default FleetList
