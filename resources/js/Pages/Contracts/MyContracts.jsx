import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import MyContractMap from '../../Shared/Components/Contracts/MyContractMap'
import AppLayout from '../../Shared/AppLayout'
import {
  faArrowDownWideShort,
  faArrowUp,
  faArrowUpShortWide,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import Card from '../../Shared/Elements/Card'
import { formatDistanceToNowStrict } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'
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
  })
  // columnHelper.accessor('id', {
  //   cell: info => <AssignAction data={info.getValue()} />
  // })
]

// const AssignAction = ({ data }) => {
//   const { auth } = usePage().props
//
//   async function bidForContract (id) {
//     const data = {
//       id,
//       userId: auth.user.id
//     }
//     const bid = axios.post('/api/contracts/bid', data)
//     await toast.promise(bid, {
//       loading: '...Bidding on contract',
//       success: 'Contract won!',
//       error: 'Issue processing bid'
//     }, { position: 'top-right' })
//     Inertia.reload({ only: ['contracts'] })
//   }
//   return (
//     <button onClick={() => bidForContract(data)} className="btn btn-primary btn-xs">
//       <FontAwesomeIcon icon={faCheck} />
//     </button>
//   )
// }

const MyContracts = ({ contracts }) => {
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

  function updateSelectedContract (contract) {
    setSelectedContract(contract)
  }

  async function addToFlight (contract) {
    const qty = window.prompt('How much cargo do you want to assign?', contract.cargo_qty)
    if (qty < 1 || (qty % 1) !== 0) {
      window.alert('You must choose a whole number more than 0')
      return
    }

    if (qty > contract.cargo_qty) {
      window.alert('You must choose a whole number no more than original cargo')
      return
    }

    const data = {
      id: contract.id,
      qty,
      userId: auth.user.id,
      action: 'assign'
    }
    const assign = axios.post('/api/contracts/assign', data)
    await toast.promise(assign, {
      loading: '...Assigning contract',
      success: 'Contract added!',
      error: 'Issue assigning contract'
    }, { position: 'top-right' })
    Inertia.reload()
  }

  return (
    <div className="flex space-x-2">
      <div className="w-3/5 max-h-fit">
        <Card>
          <div className="">
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
                  <th>Assign</th>
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
                  <td>
                    {row.original.user_id === null
                      ? (
                        <button onClick={() => addToFlight(row.original)} className="btn btn-primary btn-xs">
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        )
                      : <span>Assigned</span>
                    }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
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

MyContracts.layout = page => <AppLayout children={page} title="Available Contracts" heading="Available Contracts" />

export default MyContracts
