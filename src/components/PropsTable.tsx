import type { PropRow } from "../data/reference";

interface PropsTableProps {
  rows: PropRow[];
  /** Column header for the first column. */
  nameHeader?: string;
}

export function PropsTable({ rows, nameHeader = "Option" }: PropsTableProps) {
  return (
    <div className="table-wrap">
      <table className="props">
        <thead>
          <tr>
            <th>{nameHeader}</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="col-name">
                <code>{row.name}</code>
              </td>
              <td className="col-type">
                <code>{row.type}</code>
              </td>
              <td>
                <code>{row.default}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
