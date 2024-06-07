function event_formatter(event) {
	options = {
		"weekday": "long"
	};
	dateDayOfWeek = new Intl.DateTimeFormat("fr-FR", options).format(event["startDate"]);
	date = event["startDate"].getDate();

	timeOptions = {
		"hour": "2-digit",
		"minute": "2-digit",
	};
	startHour = event["startDate"].toLocaleTimeString("fr-FR", timeOptions);
	endHour = event["endDate"].toLocaleTimeString("fr-FR", timeOptions);

	title = event["title"];
	description = strip_tags(event["description"], "<b><strong><i><em><u>");

	event_tag = $(`
<div>
<date>${dateDayOfWeek} <jour>${date}</jour></date>
<evenement>
<heure>${startHour}-${endHour}</heure>
<titre>${title}</titre>
<description>${description}</description>
</evenement>
</div>
			 `);

	return event_tag;
}
