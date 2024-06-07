class EventFormatter {
	static format(event) {
		const startTime = this.#formatTime(event["startDate"]);
		const endTime = this.#formatTime(event["endDate"]);
		const title = this.#formatTitle(event["title"]);
		const description = this.#formatDescription(event["description"]);

		const event_tag = `
<evenement>
<heure>${startTime}-${endTime}</heure>
<titre>${title}</titre>
<description>${description}</description>
</evenement>
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
<div>
<date>${dateDayOfWeek} <jour>${date}</jour></date>
${event_fmt}
</div>
			 `);

	return event_tag;
}
