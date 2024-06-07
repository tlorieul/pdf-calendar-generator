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

function event_formatter(event) {
	options = {
		"weekday": "long"
	};
	dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
	date = event["startDate"].getDate();

	event_fmt = EventFormatter.format(event);
	event_tag = $(`
<day-events-block>
<date-block>${dateDayOfWeek} <date>${date}</date></date-block>
${event_fmt}
</day-events-block>
			 `);

	return event_tag;
}
