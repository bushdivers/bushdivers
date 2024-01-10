import { Icon } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { Ban, CheckCircle2, User, UserCog } from 'lucide-react'
import React from 'react'

import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'

const Users = ({ users }) => {
  return (
    <div className="p-4">
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="table table-auto">
          <thead>
            <tr>
              <th>Pilot Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Airport</th>
              <th>Total Points</th>
              <th>Opted In</th>
              <th>Patreon</th>
              <th>Status</th>
              <th>Admin</th>
              <th>Roles</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.pilot_id}</td>
                <td>{entry.name}</td>
                <td>{entry.email}</td>
                <td>{entry.current_airport_id}</td>
                <td>{entry.points}</td>
                <td>{entry.opt_in ? 'Yes' : 'No'}</td>
                <td>{entry.is_supporter ? 'Yes' : 'No'}</td>
                <td>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {entry.is_active ? 'Active' : 'Blocked'}
                    </span>
                    <Link
                      href={`/admin/users/active/${entry.id}`}
                      className="btn btn-light btn-small flex"
                    >
                      {entry.is_active ? (
                        <Icon as={Ban} />
                      ) : (
                        <Icon as={CheckCircle2} />
                      )}
                    </Link>
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {entry.is_admin ? 'Yes' : 'No'}
                    </span>
                    <Link
                      href={`/admin/users/admin/${entry.id}`}
                      className="btn btn-light btn-small flex"
                    >
                      {entry.is_admin ? (
                        <Icon as={User} />
                      ) : (
                        <Icon as={UserCog} />
                      )}
                    </Link>
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    {entry.user_roles &&
                      entry.user_roles.map((role) => role + ' ')}
                  </div>
                </td>
                <td>{format(new Date(entry.created_at), 'dd LLL yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pages={users} />
      </div>
    </div>
  )
}

Users.layout = (page) => (
  <AppLayout children={page} title="Admin - Users" heading="Users" />
)

export default Users
