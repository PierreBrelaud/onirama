const timeStampToDate = (timestamp) => {
    return new Date(timestamp)
}

const displayDate = (date) => {
    var options = {
        // weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric"
    };
    return date.toLocaleDateString("fr-FR", options);
}

const displayTimestamp = (timestamp) => {
    return displayDate(timeStampToDate(timestamp));
}

export { timeStampToDate, displayDate, displayTimestamp }