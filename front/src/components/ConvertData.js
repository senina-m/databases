
const get_yyyymmdd = (d) => {
    console.log("date", d);

    if (d === undefined){
        return "null"
    }else{
        const date = new Date(d);
        
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2,'0');
        const dd = String(date.getDate()).padStart(2,'0');
        return `${yyyy}-${mm}-${dd}`
    } 
}
export default get_yyyymmdd
