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


class EventsListFormatterAbstract {
	format(events) {
		throw Error("not implemented");
	}
}

class EventsListFormatter {
	format(events) {
		let result = []
		for(const event of events) {
			let options = {
				"weekday": "long"
			};
			let dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
			let date = event["startDate"].getDate();

			let eventFmt = EventFormatter.format(event);
			let eventStr = `
<day-events-block>
<date-block>${dateDayOfWeek} <date>${date}</date></date-block>
${eventFmt}
</day-events-block>
			 `;

			result.push(eventStr);
		}

		return result;
	}
}

class EventsGroupedByDateListFormatter extends EventsListFormatterAbstract {
	format(events) {
		// Group events by date
		let events_by_date = new Map();
		for(const event of events) {
			let date = event["startDate"].getDate();
			
			if(events_by_date.get(date) === undefined)
				events_by_date.set(date, []);
			
			events_by_date.get(date).push(event);
		}

		
		let events_html = []
		for(const events of events_by_date.values()) {
			// Get date of the current group
			let event = events[0];
			let options = {
				"weekday": "long"
			};
			let dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
			let date = event["startDate"].getDate();

			let events_fmt = [];
			for(const event of events) {
				let event_fmt = EventFormatter.format(event);
				events_fmt.push(event_fmt);
			}
			let events_str = events_fmt.join("");

			let day_events_html = `
<day-events-block>
<date-block>${dateDayOfWeek} <date>${date}</date></date-block>
${events_str}
</day-events-block>
			 `;
			events_html.push(day_events_html);
		}

		return events_html;
	}
}


class PaginizerAbstract {
	paginize(eventsHTML) {
		throw Error("not implemented");
	}

	createPage(month) {
		let page = $(`<page>
	  <header>
        <month>${month}</month>

        <img src="imgs/internet-icon_blue.svg" style="width: 15px; height: 15px;" />
		quartiergenereux.fr
		<br>

		<img src="imgs/facebook-icon_blue.svg" style="width: 15px; height: 15px;" />
		<img src="imgs/instagram-icon_blue.svg" style="width: 15px; height: 15px;" />
		QG.montpellier
	  </header>

    </page>
		`);
		page.appendTo("body");

		return page;
	}
}

class LinearPaginizer extends PaginizerAbstract {
	paginize(eventsHTML) {
		// TODO
		let month = "Mars";
		let page = this.createPage(month);

		for(const eventHTML of eventsHTML) {
			let eventTag = $(eventHTML);
			page.append(eventTag);

			let pageBottomPosition = page.position().top + page.height();
			let eventBlockBottomPosition = eventTag.position().top + eventTag.outerHeight();
			if(pageBottomPosition < eventBlockBottomPosition) {
				page.remove(eventTag);

				// month = ...
				page = this.createPage(month);
				page.append(eventTag);
			}
		}
	}
}

class PerWeekPaginizer extends PaginizerAbstract {
	paginize(eventsHTML) {
		throw Error("not implemented");
	}
}
