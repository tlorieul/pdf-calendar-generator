class EventFormatter {
	static format(event) {
		const startTime = this.#formatTime(event["startDate"]);
		const endTime = this.#formatTime(event["endDate"]);
		const title = this.#formatTitle(event["title"]);
		const description = this.#formatDescription(event["description"]);

		const event_tag = `
<event>
<hour>${startTime}-${endTime}</hour>
<name>${title}</name>
<description>${description}</description>
</event>
		`;
		return event_tag;
	}

	static #formatTime(time) {
		// Formats to HH:MM (09:30, 23:59, etc.)
		const timeOptions = {
			"hour": "2-digit",
			"minute": "2-digit",
		};
		return time.toLocaleTimeString("fr-FR", timeOptions);
	}

	static #formatTitle(title) {
		return title;
	}

	// TODO complete this
	static #formatDescription(description) {
		// Remove most HTML tags
		return strip_tags(description, "<b><strong><i><em><u>");
	}
}

function events_by_date_formatter(events) {
	events_by_date = new Map();
	for(const event of events) {
		date = event["startDate"].getDate();
		
		if(events_by_date.get(date) === undefined)
			events_by_date.set(date, []);
		
		events_by_date.get(date).push(event);
	}

	
	events_html = []
	
	for(const events of events_by_date.values()) {
		event = events[0];
		options = {
			"weekday": "long"
		};
		dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
		date = event["startDate"].getDate();

		events_fmt = [];
		
		for(const event of events) {
			event_fmt = EventFormatter.format(event);
			events_fmt.push(event_fmt);
		}
		events_str = events_fmt.join("");

		day_events_html = `
<day-events-block>
<date-block>${dateDayOfWeek} <date>${date}</date></date-block>
${events_str}
</day-events-block>
			 `;
		events_html.push(day_events_html);
	}

	return events_html;
}


function event_formatter(event) {
	result = []
	
	for(const event of events) {
		options = {
			"weekday": "long"
		};
		dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
		date = event["startDate"].getDate();

		event_fmt = EventFormatter.format(event);
		event_str = `
<day-events-block>
<date-block>${dateDayOfWeek} <date>${date}</date></date-block>
${event_fmt}
</day-events-block>
			 `;

		result.push(event_str);
	}

	return result;
}
