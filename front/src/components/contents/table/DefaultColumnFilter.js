import React from "react";

const DefaultColumnFilter = ({column: { filterValue, preFilteredRows, setFilter },}) => {
    // const count = preFilteredRows.length;
  
    return (
    <div>
        <br/>
        <input value={filterValue || ''} className="filer-input" onChange={ e => {setFilter(e.target.value || undefined) }} // Set undefined to remove the filter entirely
        placeholder={`Поиск...`} />
    </div>
    );
}

export default DefaultColumnFilter;