import firebase from "firebase/app";
import "firebase/firestore";

const dateToFirestoreTimestamp = (date) => {
	return firebase.firestore.Timestamp.fromDate(date);
};

const getDateFromTimestamp = (timestamp) => {
    const date = timestamp.toDate()

    const year = date.getFullYear();
    let
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate()

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const timeStampToDate = (timestamp) => {
	return new Date(timestamp);
};

const displayDate = (date) => {
	var options = {
		// weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return date.toLocaleDateString("fr-FR", options);
};

const displayTimestamp = (timestamp) => {
	return displayDate(timeStampToDate(timestamp));
};

//return la difference entre 2 dates sous forme obj
const timeDiffCalc = (dateFuture, dateNow) => {
	function z(n) {
		return (n < 10 ? "0" : "") + n;
	}
	let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

	// calculate days
	let days = Math.floor(diffInMilliSeconds / 86400);
	diffInMilliSeconds -= days * 86400;

	// calculate hours
	let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
	diffInMilliSeconds -= hours * 3600;
	// calculate minutes
	let minutes = Math.floor(diffInMilliSeconds / 60) % 60;
	diffInMilliSeconds -= minutes * 60;

	let seconds = diffInMilliSeconds;

	let objDate = {
		days: days,
		hours: z(hours),
		minutes: z(minutes),
		seconds: z(seconds),
	};

	return objDate;
	//return days  + ':' + z(hours) + ':' + z(minutes) + ':' + z(seconds);
};

// return str as DD:HH:MM:SS
const formatDateAsString = (objDate, displayDay) => {
	function z(n) {
		return (n < 10 ? "0" : "") + n;
	}
	let daysStr = "";
	if (displayDay) {
		daysStr = objDate.days + ":";
	}
	return (
		daysStr +
		z(objDate.hours) +
		":" +
		z(objDate.minutes) +
		":" +
		z(objDate.seconds)
	);
};

//return en seconds une date sous forme DD:HH:MM:SS
const dhmsToSeconds = (s) => {
	let b = s.split(":");
	return b[0] * 86400 + b[1] * 3600 + b[2] * 60 + (+b[3] || 0);
};

export {
	dateToFirestoreTimestamp,
	timeStampToDate,
	displayDate,
	displayTimestamp,
	timeDiffCalc,
	dhmsToSeconds,
	formatDateAsString,
};
