const API_KEY = "AIzaSyDL4YMF0baYwuwdsZVlB-DHSEXkfIpR4hQ";
const CALENDAR_ID = "1a765f00b1b3157f7f659f5d0f7343cc9b27d1ece10523108b5adf9ff5f98c82@group.calendar.google.com";

// TODO better error handling
function gapiLoaded() {
	gapi.load("client", {
		callback: initializeGapiClient,
		onerror: function() {
			// Handle loading error.
			console.log("gapi.client failed to load!")
			alert("gapi.client failed to load!");
		},
		timeout: 5000,
		ontimeout: function() {
			// Handle timeout.
			console.log("gapi.client could not load in a timely manner!")
			alert("gapi.client could not load in a timely manner!");
		}
	});
}

// TODO better error handling
async function initializeGapiClient() {
	gapi.client.setApiKey(API_KEY);
	await fetch("google_calendar_api_rest.json").then(function(resp) {
		return resp.json();
    }).then(function(json) {
		calendarApiDiscovery = json;
		return Promise.resolve();
    });
	res = gapi.client.load(calendarApiDiscovery).then(function () {
	}, function () {
		console.log("error")
	});

	gapiInited = true;
}

function loadGoogleCalendar(startTime, endTime) {
	// TODO attendre la fin du chargement
	if (gapiInited) {
		// TODO add a warning if limit reached?
		const limit = 250;    // default value

		return gapi.client.calendar.events.list({
			calendarId: CALENDAR_ID,
			showDeleted: false,
			singleEvents: true,
			maxResults: limit,
			orderBy: "startTime",
			timeMin: startTime.toISOString(),   // TODO change to RFC3339
			timeMax: endTime.toISOString(),     // TODO change to RFC3339
		});
	}
}

async function loadCalendarsEvents(startDate, endDate) {
	// TODO récupérer la timezone du calendrier
	startTime = new Date(startDate);
	startTime.setHours(0, 0, 0, 0);
	
	endTime = new Date(endDate);
	endTime.setHours(23, 59, 59, 999);
	
	response = await loadGoogleCalendar(startTime, endTime);
	data = response.result.items;

	events = []
	for(const i of data.keys()) {
		events[i] = {
			"startDate": new Date(data[i].start.dateTime),
			"endDate": new Date(data[i].end.dateTime),
			"title": data[i].summary,
			"description": data[i].description,
		}
	}

	return events;
}


