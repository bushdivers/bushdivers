import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel, getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownWideShort, faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons'
import PaginationTable from '../../Shared/Elements/PaginationTable'
import { format } from 'date-fns'

const columnHelper = createColumnHelper()
const columns = [
  columnHelper.accessor('total', {
    cell: info => <span className="text-right">${parseFloat(info.getValue()).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>,
    header: () => <span>Amount</span>
  }),
  columnHelper.accessor('transaction_type', {
    cell: info => <span>{renderTransactionType(info.getValue())}</span>,
    header: () => <span>Transaction Type</span>
  }),
  columnHelper.accessor('memo', {
    cell: info => info.getValue(),
    header: () => <span>Memo</span>
  }),
  columnHelper.accessor('created_at', {
    cell: info => <span>{format(new Date(info.getValue()), 'dd LLL yyyy hh:mm', { timeZone: 'UTC' })}</span>,
    header: () => <span>Date</span>
  })
]

const renderTransactionType = (transactionType) => {
  switch (transactionType) {
    case 1:
      return 'Hub Rental'
    case 2:
      return 'Aircraft Storage'
    case 3:
      return 'Aircraft Operations'
    case 4:
      return 'Aircraft Maintenance'
    case 5:
      return 'Ground Handling'
    case 6:
      return 'Landing Fees'
    case 7:
      return 'Fuel Costs'
    case 8:
      return 'Contract Income'
    case 9:
      return 'Contract Pilot Pay'
    case 10:
      return 'General Expenditure'
  }
}

const CompanyFinances = ({ accounts, balance, aircraftStorage, aircraftOps, hubs }) => {
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
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between">
        <div className="md:w-1/2 md:mx-2">
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
        <div className="md:w-1/2 md:mx-2 flex flex-col space-y-2">
          <Card title="Account Balance">
            <h3>${parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
          </Card>
          <Card title="Monthly Costs">
            <div className="my-2">
              <h4>Aircraft Operations</h4>
              <span className="text-xl">${parseFloat(aircraftOps).toLocaleString()}</span>
            </div>
            <div className="my-2">
              <h4>Aircraft Storage</h4>
              <span className="text-xl">${parseFloat(aircraftStorage).toLocaleString()}</span>
            </div>
            <div className="my-2">
              <h4>Hub Rentals</h4>
              <span className="text-xl">${parseFloat(hubs).toLocaleString()}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

CompanyFinances.layout = page => <AppLayout children={page} title="Bush Divers Finances" heading="Bush Divers Finances" />

export default CompanyFinances
