export function dateHandler(date: string) {
    if (!date) return null;
    let newDate = date.split(',');
    const newTime = newDate[1];
    newDate = newDate[0].split('/');
    const final = newDate[2] + "-" + newDate[1] + "-" + newDate[0] + newTime;
    if (!newDate || !newTime || !final) return null;
    return (final);
}
export const getISOUserFriendlyString= (date:Date) => new Date(date).toLocaleString().replace("T"," ").replace(".000Z","");
export const fixFormDate = (date:Date) => {

    console.log(new Date(date.toString()+":00.000Z"))
    // .replace("T"," ").replace(".000Z","");
return date;
}
export const isGraterThanToday = (date: Date) =>{console.log("validateing date > new Date(); ",date.toISOString() ,  new Date().toISOString() ); return date > new Date(); }
// export const isGraterThanToday = (date: Date) => date > new Date();
export const isDateRangeValid = (start: Date, end: Date) =>  start < end;
export function validateStartEndTime(start: Date, end: Date){
    if(start)
    if (!isGraterThanToday(start)) throw  new Error("Start Time must be in the future");
    if(end)
    if (!isGraterThanToday(end)) throw  new Error("End Time must be in the future");
    if(start && end)
    if (!isDateRangeValid(start, end)) throw new Error("Start Time must be Less thn the End Time");
}