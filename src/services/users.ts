export default async function fetchUsers({
  pageParam = 1,
}: {
  pageParam?: number;
}) {
  return await fetch(
    `https://randomuser.me/api?results=10&seed=erick&page=${pageParam}`
  )
    .then(async (res) => {
      if (!res.ok) throw new Error('Error en la peticion');
      return await res.json();
    })

    .then((res) => {
      const currentPage = Number(res.info.page);
      const nextCursor = currentPage > 3 ? undefined : currentPage + 1;

      return {
        users: res.results,
        nextCursor,
      };
    });
}
