import React from "react";

const DefaultColumnFilter = ({column: { filterValue, preFilteredRows, setFilter },}) => {
    const count = preFilteredRows.length
  
    return (
    <div>
        <br/>
        <label for="inp" class="inp"/>
        <input value={filterValue || ''} className="filer-input" onChange={ e => {setFilter(e.target.value || undefined) }} // Set undefined to remove the filter entirely
        placeholder={`Поиск среди ${count} вхождений...`} />
    </div>
    );
}

export default DefaultColumnFilter;