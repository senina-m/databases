import {useTable, useFilters, useSortBy} from 'react-table';
import DefaultColumnFilter from './DefaultColumnFilter';
import React from 'react';

const Table = ({ columns, data }) => {
        const defaultColumn = React.useMemo(
      () => ({
          Filter: DefaultColumnFilter,
      }),
      []
    )

    const filterTypes = React.useMemo(
      () => ({
        text: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue !== undefined
              ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
              : true
          })
        },
      }),
      []
    )

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
    //   footerGroups,
      rows,
      prepareRow,
    } = useTable(
      {columns,
       data,
       defaultColumn,
       filterTypes},
       useFilters,
       useSortBy);

    // Render the UI for your table
    return (
      <table
        {...getTableProps()}
        border={1}
        className="table">
        <thead className="table-head">
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                  <span>
                       {column.isSorted
                           ? column.isSortedDesc
                               ? '🔽'
                               : '🔼'
                           : ''}
                    </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="table-body">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        {/* <tfoot>
          {footerGroups.map((group) => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map((column) => (
                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
    );
  }

  export default Table;