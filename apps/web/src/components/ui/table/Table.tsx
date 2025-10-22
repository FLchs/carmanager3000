type Props = {
  headers: string[];
  rows: Array<
    Record<string, Date | null | number | string | undefined> & {
      id: number | string;
    }
  >;
};

export const Table = ({ headers, rows }: Props) => {
  return (
    <table className="w-full text-left">
      <thead className="font-bold border-b border-border">
        <tr>
          {headers.map((header) => (
            <th className="px-4 py-2" key={`header-${header}`} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const { id, ...data } = row;
          return (
            <tr
              className="border-b  border-border hover:bg-bg-dark last:border-0"
              key={id}
            >
              {Object.entries(data).map(([key, value]) => {
                return (
                  <td className="py-2 px-4" key={key}>
                    {value instanceof Date ? value?.toLocaleString() : value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
