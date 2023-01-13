import React from 'react';
import get from '../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';

import GlobalFilter from './table/GlobalFilter';
import DefaultColumnFilter from './table/DefaultColumnFilter';
import { useTable, useSortBy, useFilters, useGlobalFilter} from 'react-table';

const CreatureTable = () => {
  const navigate = useNavigate();

  const getCreaturesList = () => {
    let token = ReactSession.get("token");
    return get("/creatures", {}, token).then(
      (json) => {
        if (json.status === 200) {
          delete json.status;
          console.log("here", json);
          return json;
        } else if (json.status === 401 || json.status === 403) {
          navigate("/forbidden", { replace: true });
        }
      }).catch((json) => {
        console.log("Fail to request list of creatures");
    });
  }


  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const columns = React.useMemo(
    () => (
      [
        {
          Header: 'Имя',
          columns: [{accessor: 'name'}]
        },
        {
          Header: 'День Рождения',
          columns: [{accessor: 'birthday'}]
        },
        {
          Header: 'День смерти',
          columns: [{accessor: 'death_date'}]
        },
        {
          Header: 'Раса',
          columns: [{accessor: 'race'}]
        },
        {
          Header: 'Пол',
          columns: [{accessor: 'sex'}]
        }
      ]
    ), [])

  const data = React.useMemo(getCreaturesList, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                          ? column.isSortedDesc
                              ? '🔽'
                              : '🔼'
                          : ''}
                   </span>
                   <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
              ))}
            </tr>
        ))}
        <tr>
          <th
            colSpan={visibleColumns.length}>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                      <td{...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                  )
                })}
              </tr>
          )
        })}
        </tbody>
      </table>
  </div>
);
}


//   let i = 0;
//   return (
//     <>
//     <p>{data === undefined ? "data undefined" : "data not undefined"}</p>
//     <p>{data === null ? "data null" : "data not null"}</p>
//     <table className='attempts-table container'>
//       <thead>
//         <tr>
//           <th>Имя</th>
//           <th>Дата рождения</th>
//           <th>Дата смерти</th>
//           <th>Раса</th>
//           <th>Пол</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data !== undefined && data !== null && data.map((val) => {
//           return (
//             <tr key={i++}>
//               <td>{val.name}</td>
//               <td>{val.birthday}</td>
//               <td>{val.death_date}</td>
//               <td>{val.race}</td>
//               <td>{val.sex}</td>
//             </tr>
//           )
//         })}
//       </tbody>
//     </table>
//   </>

//   );
// }

export default CreatureTable