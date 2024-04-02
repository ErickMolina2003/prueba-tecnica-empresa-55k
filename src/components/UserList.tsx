import { SortBy, User } from '../types.d';
import './UserList.css';
import './UserList.css'

export default function UserList({
  users,
  showColors,
  handleDeleteUser,
  changeSorting,
}: {
  users: User[];
  showColors: boolean;
  handleDeleteUser: (value: string) => void;
  changeSorting: (value: SortBy) => void;
}) {
  return (
    <>
      <table width={'100%'}>
        <thead>
          <tr>
            <th>Foto</th>
            <th className='pointer' onClick={() => changeSorting(SortBy.NAME)}>Nombre</th>
            <th className='pointer' onClick={() => changeSorting(SortBy.LAST)}>Apellido</th>
            <th className='pointer' onClick={() => changeSorting(SortBy.COUNTRY)}>Pais</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: User, index: number) => {
            return (
              <tr
                key={user.email}
                className={`${
                  showColors
                    ? index % 2 == 0
                      ? `${index} colored-pair-row`
                      : `${index} colored-row`
                    : 'No-color'
                }`}
              >
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.email)}>
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
