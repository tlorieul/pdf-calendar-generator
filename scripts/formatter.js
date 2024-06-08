class EventFormatter {
	static format(event) {
		const startTime = this.formatTime(event["startDate"]);
		const endTime = this.formatTime(event["endDate"]);
		const title = this.formatTitle(event["title"]);
		const description = this.formatDescription(event["description"]);

		const event_tag = `
<event>
<hour>${startTime}-${endTime}</hour>
<name>${title}</name>
<description>${description}</description>
</event>
		`;
		return event_tag;
	}

	static formatTime(time) {
		// Formats to HH:MM (09:30, 23:59, etc.)
		const timeOptions = {
			"hour": "2-digit",
			"minute": "2-digit",
		};
		return time.toLocaleTimeString("fr-FR", timeOptions);
	}

	static formatTitle(title) {
		// No specific formatting
		return title;
	}

	// TODO detect when no truncation can be done
	static formatDescription(description) {
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

	formatDay(date) {
		return date.getDate();
	}

	formatDayOfWeek(date) {
		let options = {
			"weekday": "long",
		};
		return new Intl.DateTimeFormat("fr-FR", options).format(date);

	}
}

class EventsListFormatter extends EventsListFormatterAbstract {
	format(events) {
		let result = []
		for(const event of events) {
			let date = event["startDate"];
			let day = this.formatDay(date);
			let dateDayOfWeek = this.formatDayOfWeek(date);

			let eventFmt = EventFormatter.format(event);
			let dayBlockTag = $(`
<day-events-block>
<date-block>${dateDayOfWeek} <date>${day}</date></date-block>
${eventFmt}
</day-events-block>
			`);
			dayBlockTag.data("date", date);

			result.push(dayBlockTag);
		}

		return result;
	}
}

class EventsGroupedByDateListFormatter extends EventsListFormatterAbstract {
	format(events) {
		// Group events by date
		let eventsByDate = new Map();
		for(const event of events) {
			let date = event["startDate"].toDateString();
			
			if(eventsByDate.get(date) === undefined) {
				console.log(date);
				eventsByDate.set(date, []);
			}
			
			eventsByDate.get(date).push(event);
		}

		
		let events_html = []
		for(const events of eventsByDate.values()) {
			// Get date of the current group
			let date = events[0]["startDate"];
			let day = this.formatDay(date);
			let dateDayOfWeek = this.formatDayOfWeek(date);

			let events_fmt = [];
			for(const event of events) {
				let event_fmt = EventFormatter.format(event);
				events_fmt.push(event_fmt);
			}
			let events_str = events_fmt.join("");

			let dayEventsTag = $(`
<day-events-block>
<date-block>${dateDayOfWeek} <date>${day}</date></date-block>
${events_str}
</day-events-block>
			`);
			dayEventsTag.data("date", date);
			events_html.push(dayEventsTag);
		}

		return events_html;
	}
}


class PaginizerAbstract {
	paginize(eventsHTML) {
		throw Error("not implemented");
	}

	createPage(month = "") {
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

	updateMonthText() {
		let pages = $("page");

		for(let page of pages) {
			page = $(page);
			let dayBlocks = page.find("day-events-block");
			// FIXME always determines the month name based on first date of the page
			let date = $(dayBlocks[0]).data("date");

			let options = {
				"month": "long",
			};
			let month = new Intl.DateTimeFormat("fr-FR", options).format(date);

			page.find("month").html(month);
		}
	}
}

// Mainly for debugging purposes
class SinglePagePaginizer extends PaginizerAbstract {
	paginize(eventsTags) {
		let page = this.createPage();
		page.append(eventsTags);

		for(const eventTag of eventsTags) {
			page.append(eventTag);
		}
	}
}

class LinearPaginizer extends PaginizerAbstract {
	paginize(eventsHTML) {
		let page = this.createPage();

		for(const eventHTML of eventsHTML) {
			let eventTag = eventHTML;
			page.append(eventTag);

			let pageBottomPosition = page.position().top + page.height();
			let eventBlockBottomPosition = eventTag.position().top + eventTag.outerHeight();
			if(pageBottomPosition < eventBlockBottomPosition) {
				eventTag.detach();

				page = this.createPage();
				page.append(eventTag);
			}
		}

		this.updateMonthText();
	}
}

class PerWeekPaginizer extends PaginizerAbstract {
	paginize(eventsHTML) {
		throw Error("not implemented");
	}
}
