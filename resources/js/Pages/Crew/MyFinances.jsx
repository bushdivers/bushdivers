import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import {
  createColumnHelper, flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownWideShort, faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons'
import PaginationTable from '../../Shared/Elements/PaginationTable'

const columnHelper = createColumnHelper()
const columns = [
  columnHelper.accessor('total', {
    cell: info => <span className="text-right">${parseFloat(info.getValue()).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>,
    header: () => <span>Amount</span>
  }),
  columnHelper.accessor('type', {
    cell: info => <span>{renderTransactionType(info.getValue())}</span>,
    header: () => <span>Transaction Type</span>
  }),
  columnHelper.accessor('created_at', {
    cell: info => <span>{format(new Date(info.getValue()), 'dd LLL yyyy hh:mm', { timeZone: 'UTC' })}</span>,
    header: () => <span>Date</span>
  })
]

const renderTransactionType = (transactionType) => {
  switch (transactionType) {
    case 1:
      return 'Contract Pay'
    case 2:
      return 'Jumpseat'
    case 3:
      return 'Contract Cancellation'
    case 4:
      return 'Refuel Penalty'
    case 5:
      return 'Bonus Pay (i.e returning aircraft to hub)'
    case 6:
      return 'Aircraft Rental Fees'
    case 7:
      return 'Fuel Fees'
    case 8:
      return 'Ground Handling Fees'
    case 9:
      return 'Landing Fees'
    case 10:
      return 'Aircraft Maintenance Fees'
    case 11:
      return 'Monthly Aircraft Ownership cost'
    case 12:
      return 'Aircraft Purchase'
    case 13:
      return 'Aircraft Sale'
    default:
      return 'Other'
  }
}

const MyFinances = ({ accounts, balance }) => {
  const [sorting, setSorting] = React.useState([])

  const tbl = useReactTable({
    data: accounts.data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
      <div className="md:w-1/2">
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
              <tr key={row.id}>
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
        <div className="mt-2">
          <PaginationTable table={tbl} />
        </div>
      </div>
        <div className="md:w-1/2 md:mx-2">
          <Card title="Current Balance">
            <h4>${balance.toFixed(2)}</h4>
          </Card>
        </div>
      </div>
    </div>
  )
}

MyFinances.layout = page => <AppLayout children={page} title="My Finances" heading="My Finances" />

export default MyFinances
