import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoContent from '../../Shared/Elements/NoContent'
import { Link } from '@inertiajs/inertia-react'
import FleetAircraft from '../../Shared/Components/Admin/FleetAircraft'
import AppLayout from '../../Shared/AppLayout'
import { faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Card from '../../Shared/Elements/Card'
import { Inertia } from '@inertiajs/inertia'

const EmptyData = (props) => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no fleet</div>
    </>
  )
}

const FleetList = ({ fleet, rental }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  const handleDelete = (id) => {
    const accept = window.confirm('Are you sure you wish to delete this fleet?')
    if (!accept) return

    Inertia.delete(`/admin/fleet/delete/${id}`)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <Card>
          <div className="overflow-x-auto">
            <div className="flex justify-between">
              {fleet && fleet.length > 0 && <button onClick={toggleDetail} className="btn btn-secondary m-2">Toggle fleet aircraft details</button>}
              <div className="inline m-2">
                <Link href="/admin/fleet/create" className="btn btn-secondary mr-2">Add new fleet</Link>
                <Link href="/admin/aircraft/create" className="btn btn-secondary">Add new aircraft</Link>
              </div>
            </div>
            {!fleet && <NoContent content={<EmptyData />} />}
            {fleet && fleet.length > 0 &&
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
                {fleet && fleet.map((f) => (
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
                            <Link href={`/admin/fleet/edit/${f.id}`} className="btn btn-secondary flex items-center mr-2">
                              <FontAwesomeIcon icon={faPen} />
                            </Link>
                            <Link href={`/admin/aircraft/create?fleet=${f.id}`} className="btn btn-light flex items-center mr-2">
                              <FontAwesomeIcon icon={faPlus} />
                            </Link>
                            {f.aircraft.length === 0 &&
                              <Link onClick={() => handleDelete(f.id)} className="btn btn-light flex items-center mr-2">
                                <FontAwesomeIcon icon={faTrashCan} />
                              </Link>
                            }
                        </div>
                      </td>
                    </tr>
                    { showDetail && <FleetAircraft fleet={f} />}
                  </>
                ))}
                </tbody>
              </table>
            </div>
              // )
            }
          </div>
          </Card>
      </div>
    </div>
  )
}

FleetList.layout = page => <AppLayout children={page} title="Admin - Fleet" heading="Fleet List" />

export default FleetList
