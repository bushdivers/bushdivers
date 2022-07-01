import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import FleetAircraft from '../../Shared/Components/Admin/FleetAircraft'
import AppLayout from '../../Shared/AppLayout'
import { faClose, faPen } from '@fortawesome/free-solid-svg-icons'

const EmptyData = (props) => {
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

  return (
    <div className="p-4">
      <PageTitle title="Fleet" />
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full">
          <div className="rounded shadow bg-white overflow-x-auto mt-4">
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
              <table className="table-condensed table-auto">
                <thead>
                <tr className="">
                  <th>Id</th>
                  <th>Type</th>
                  <th>Manufacturer</th>
                  <th>Name</th>
                  <th>Qty</th>
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
                      <td>
                        <div className="flex items-center">
                            <Link href={`/admin/fleet/edit/${f.id}`} className="btn btn-secondary flex items-center mr-2">
                              <FontAwesomeIcon icon={faPen} />
                            </Link>
                            <Link href={`/admin/fleet/delete/${f.id}`} className="btn btn-light flex items-center mr-2">
                              <FontAwesomeIcon icon={faClose} />
                            </Link>
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
        </div>
    </div>
    </div>
  )
}

FleetList.layout = page => <AppLayout children={page} title="Admin - Fleet" heading="Fleet List" />

export default FleetList
