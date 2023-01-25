
const isValidDate = (d) =>{
    return d instanceof Date && !isNaN(d);
}

const get_yyyymmdd = (d) => {

    if (isValidDate(d)){
        console.log("date", d);
        const date = new Date(d);
        
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2,'0');
        const dd = String(date.getDate()).padStart(2,'0');
        return `${yyyy}-${mm}-${dd}`;
    }else{
        return null;
    }

}

export default get_yyyymmdd
