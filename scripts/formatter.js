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
		// No specific formatting
		return title;
	}

	// TODO detect when no truncation can be done
	static #formatDescription(description) {
		const limit = 250;
		
		// To keep a space in case of HTML tag (might introduce unwanted spaces)
		description = description.replaceAll("<", " <");
		
		// Remove most HTML tags
		description = strip_tags(description, "<b><strong><i><em><u>");

		// Replace all types of spaces with a classic whitespace
		description = description.replaceAll(/\s+/gu, " ");

		// Replace three separate dots into a Unicode horizontal ellipsis
		description = description.replaceAll(/\.\.\./gu, "…");

		// Remove horizontal lines "--------"
        description = description.replaceAll(/\s+-*\s+/gu, " ");
		
		description = description.trim();

		// Maximum number of characters
		description = description.substring(0, limit);

		// Keep only the complete sentences
		const eos = String.raw`\.\?!…;` // End Of Sentence characters
		const regex = new RegExp(
			String.raw`(^[\s\S]+[${eos}])(\s([^${eos}]|([${eos}][^\s]))*)?$`,
			"u",
		);
		const matches = description.match(regex);
        if(matches)
            description = matches[1];
		
		return description;
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
