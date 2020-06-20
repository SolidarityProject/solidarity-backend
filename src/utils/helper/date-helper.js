function getDateForCheck_year(year) {
    return new Date(new Date().setFullYear(new Date().getFullYear() + year));
}

function getDateForCheck_month(month) {
    return new Date(new Date().setMonth(new Date().getMonth() + month));
}

function getDateForCheck_hour(hour) {
    console.log(new Date())
    return new Date(new Date().setHours(new Date().getHours() + hour));
}

module.exports = { getDateForCheck_year, getDateForCheck_month, getDateForCheck_hour };