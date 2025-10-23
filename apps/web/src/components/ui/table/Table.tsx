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
      <thead className="border-border border-b font-bold">
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
              className="border-border hover:bg-bg-dark border-b last:border-0"
              key={id}
            >
              {Object.entries(data).map(([key, value]) => {
                return (
                  <td className="px-4 py-2" key={key}>
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
