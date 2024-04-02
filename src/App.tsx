import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { type User } from './types';
import { SortBy } from './types.d';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const originalUsers = useRef<User[]>([]);
  // UseRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChangeColor = () => {
    setShowColors(!showColors);
  };

  const handleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDeleteUser = (email: string) => {
    const newUsers = users.filter((user) => user.email != email);
    setUsers(newUsers);
  };

  const handleResetState = () => {
    setUsers(originalUsers.current);
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

    // if (sorting === SortBy.COUNTRY)
    //   return [...filteredUsers].sort((a, b) => {
    //     return a.location.country.localeCompare(b.location.country);
    //   });

    // if (sorting === SortBy.NAME)
    //   return [...filteredUsers].sort((a, b) => {
    //     return a.name.first.localeCompare(b.name.first);
    //   });

    // if (sorting === SortBy.LAST)
    //   return [...filteredUsers].sort((a, b) => {
    //     return a.name.last.localeCompare(b.name.last);
    //   });

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
        <UserList
          users={sortedUsers}
          showColors={showColors}
          handleDeleteUser={handleDeleteUser}
          changeSorting={handleChangeSort}
        />
      </main>
    </div>
  );
}

export default App;
