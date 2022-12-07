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
    cell: info => info.getValue(),
    header: () => <span>Cargo</span>
  }),
  columnHelper.accessor('cargo', {
    cell: info => info.getValue(),
    header: () => <span>Cargo Type</span>
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
    cell: info => <BidAction data={info.getValue()} />
  })
]

const BidAction = ({ data }) => {
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
    <button onClick={() => bidForContract(data)} className="btn btn-primary btn-xs">
      <FontAwesomeIcon icon={faCheck} />
    </button>
  )
}

const AirportContracts = ({ contracts }) => {
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
        </Card>
      </div>
      <div className="w-2/5">
        <Card>
          <MyContractMap data={selectedContract} size="large" mapStyle={auth.user.map_style} />
        </Card>
      </div>
    </div>
  )
}

export default AirportContracts
