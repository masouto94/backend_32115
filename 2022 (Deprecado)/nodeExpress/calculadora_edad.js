const moment = require("moment");

const today = moment()
const birth_date = moment('21/02/1994', 'DD/MM/YYYY')
const timedelta_years = today.diff(birth_date, 'years')
const timedelta_days = today.diff(birth_date, 'days')
console.log(`Hoy es ${today.format('DD/MM/YYYY')}`)
console.log(`Naci el ${birth_date.format('DD/MM/YYYY')}`);
console.log(`Desde mi nacimiento pasaron ${timedelta_years} años`);
console.log(`Desde mi nacimiento pasaron ${timedelta_days} dias`);