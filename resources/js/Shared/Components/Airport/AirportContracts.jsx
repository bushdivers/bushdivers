import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import Card from '../../Elements/Card'
import MyContractMap from '../Contracts/MyContractMap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUp,
  faArrowUpShortWide,
  faCheck,
  faArrowDownWideShort
} from '@fortawesome/free-solid-svg-icons'
import { formatDistanceToNowStrict } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Inertia } from '@inertiajs/inertia'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

const columnHelper = createColumnHelper()
const columns = [
  columnHelper.accessor('dep_airport_id', {
    cell: info => <Link href={`/airports/${info.getValue()}`}>{info.getValue()}</Link>,
    header: () => <span>Dep</span>
  }),
  columnHelper.accessor('arr_airport_id', {
    cell: info => <Link href={`/airports/${info.getValue()}`}>{info.getValue()}</Link>,
    header: () => <span>Arr</span>
  }),
  columnHelper.accessor('distance', {
    cell: info => info.getValue(),
    header: () => <span>Dist</span>
  }),
  columnHelper.accessor('heading', {
    cell: info => (
      <div className="flex items-center">
        <div className="w-1/2">
          <span className="mr-2">{info.getValue()}</span>
        </div>
        <div className="w-1/2 flex">
          <span style={{ transform: `rotate(${info.getValue()}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-secondary" /></span>
        </div>
      </div>
    ),
    header: () => <span>Hdg</span>
  }),
  columnHelper.accessor('cargo_qty', {
    cell: info => <span>{parseFloat(info.getValue()).toLocaleString()}</span>,
    header: () => <span>Cargo Qty</span>
  }),
  columnHelper.accessor(row => `${renderCargo(row)}`, {
    id: 'cargoName',
    header: () => <span>Cargo Details</span>
  }),
  columnHelper.accessor('contract_value', {
    cell: info => <span>${parseFloat(info.getValue()).toLocaleString()}</span>,
    header: () => <span>Value</span>
  }),
  columnHelper.accessor('expires_at', {
    cell: info => <span>{formatDistanceToNowStrict(new Date(info.getValue()))}</span>,
    header: () => <span>Expires</span>
  }),
  columnHelper.accessor('id', {
    cell: info => <BidAction contract={info.getValue()} />,
    header: () => <span>Bid</span>
  })
]

const BidAction = ({ contract }) => {
  const { auth } = usePage().props
  async function bidForContract (id) {
    const data = {
      id,
      userId: auth.user.id
    }
    const bid = axios.post('/api/contracts/bid', data)
    await toast.promise(bid, {
      loading: '...Bidding on contract',
      success: 'Contract won!',
      error: 'Issue processing bid'
    }, { position: 'top-right' })
    Inertia.reload({ only: ['contracts'] })
  }
  return (
    <button onClick={() => bidForContract(contract)} className="btn btn-primary btn-xs">
      <FontAwesomeIcon icon={faCheck} />
    </button>
  )
}

function renderCargo (contract) {
  let cargoType
  switch (contract.cargo_type) {
    case 1:
      cargoType = ' lbs'
      break
    case 2:
      cargoType = ''
      break
  }
  return `${parseFloat(contract.cargo_qty).toLocaleString()}${cargoType} ${contract.cargo}`
}

const AirportContracts = ({ contracts, airport }) => {
  const { auth } = usePage().props
  const [selectedContract, setSelectedContract] = useState('')
  const [sorting, setSorting] = React.useState([])

  const tbl = useReactTable({
    data: contracts,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel()
  })

  const updateSelectedContract = (contract) => {
    setSelectedContract(contract)
  }

  return (
    <div className="flex space-x-2">
      <div className="w-3/5 max-h-fit">
        <Card>
          <div className="overflow-x-auto">
          <table className="table table-compact w-full overflow-x-auto">
            <thead>
            {tbl.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="ml-2"><FontAwesomeIcon icon={faArrowUpShortWide} /></span>,
                            desc: <span className="ml-2"><FontAwesomeIcon icon={faArrowDownWideShort} /></span>
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                        )
                    }
                  </th>
                ))}
              </tr>
            ))}
            </thead>
            <tbody>
            {tbl.getRowModel().rows.map(row => (
              <tr key={row.id} onClick={() => updateSelectedContract(row.original)} className={`${selectedContract.id === row.original.id ? 'text-primary' : ''}`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
      <div className="w-2/5">
        <Card>
          <MyContractMap data={selectedContract} airport={airport} size="large" mapStyle={auth.user.map_style} />
        </Card>
      </div>
    </div>
  )
}

export default AirportContracts
