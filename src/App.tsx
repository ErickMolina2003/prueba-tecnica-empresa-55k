import { useMemo, useState } from 'react';
import './App.css';
import { type User } from './types';
import { SortBy } from './types.d';
import UserList from './components/UserList';
import { useUsers } from './hooks/useUsers';
import Results from './components/Results';

function App() {
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
    useUsers();

  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  // const originalUsers = useRef<User[]>([]);

  const handleChangeColor = () => {
    setShowColors(!showColors);
  };

  const handleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDeleteUser = (email: string) => {
    // const newUsers = users.filter((user) => user.email != email);
    // setUsers(newUsers);
  };

  const handleResetState = () => {
    // setUsers(originalUsers.current);
    refetch();
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const filteredUsers = useMemo(() => {
    return filterCountry
      ? users.filter((user) => {
          return user.location.country
            .toLocaleLowerCase()
            .includes(filterCountry.toLocaleLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return [...filteredUsers].sort((a, b) => {
      const extractProperty = compareProperties[sorting];

      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sorting]);

  return (
    <div className='app'>
      <h1>Prueba tecnica</h1>
      <Results />
      <header style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button onClick={handleChangeColor}>Coloreal files</button>

        <button onClick={handleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por pais'
            : 'Ordenar por Pais'}
        </button>

        <button onClick={handleResetState}>Resetear estado</button>

        <input
          type='text'
          placeholder='Honduras'
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        {users.length > 0 && (
          <UserList
            users={sortedUsers}
            showColors={showColors}
            handleDeleteUser={handleDeleteUser}
            changeSorting={handleChangeSort}
          />
        )}

        {isLoading && <p>Cargando ...</p>}
        {!isLoading && isError && <p>Ha habido un error</p>}
        {!isLoading && !isError && users.length <= 0 && <p>No hay usuarios</p>}
        {!isLoading && !isError && hasNextPage && (
          <button onClick={() => fetchNextPage()}>Cargar mas resultados</button>
        )}
      </main>
    </div>
  );
}

export default App;
