<?php

// include your composer dependencies
require_once "vendor/autoload.php";

define("API_KEY", "AIzaSyDL4YMF0baYwuwdsZVlB-DHSEXkfIpR4hQ");
define("CALENDAR_ID", "1a765f00b1b3157f7f659f5d0f7343cc9b27d1ece10523108b5adf9ff5f98c82@group.calendar.google.com");

function query_google_api_events_in_period($start_date, $end_date) {
    $client = new Google\Client();
    $client->setApplicationName("AgendaGenerator");
    $client->setDeveloperKey(API_KEY);

    $service = new Google\Service\Calendar($client);

    $start_time = $start_date->format(DateTime::RFC3339);
    $end_time = $end_date->format(DateTime::RFC3339);

    $limit = 250;    // default value
    $events = $service->events->listEvents(
        CALENDAR_ID,
        [
            "showDeleted" => false,
            "singleEvents" => true,
            "maxResults" => $limit,
            "orderBy" => "startTime",
            "timeMin" => $start_time,
            "timeMax" => $end_time,
        ]
    );

    return $events;
}

function get_events_in_period($start_date, $end_date) {
    $events = query_google_api_events_in_period($start_date, $end_date);
    
    $data = array();
    foreach($events as $event) {
        $data[] = [
            "start_date" => $event->getStart()->getDateTime(),
            "end_date" => $event->getEnd()->getDateTime(),
            "title" => $event->getSummary(),
            "description" => $event->getDescription(),
        ];
    }

    return $data;
}

function group_events_per_day_per_week($events) {
    $i = 0;
    $events_per_week = [];
    foreach($events as $event) {
        $start_date = new DateTime($event["start_date"]);
        $week_number = $start_date->format("W");
        $day_number = $start_date->format("d");
        
        if(!array_key_exists($week_number, $events_per_week))
            $events_per_week[$week_number] = [];
        
        if(!array_key_exists($day_number, $events_per_week[$week_number]))
            $events_per_week[$week_number][$day_number] = [];
        
        $events_per_week[$week_number][$day_number][] = $event;
    }

    return $events_per_week;
}


class EventFormatter
{
    public function format($event) {
        $start_time = $this->_format_time($event["start_date"]);
        $end_time = $this->_format_time($event["end_date"]);
        $title = $this->_format_title($event["title"]);
        $description = $this->_format_description($event["description"]);
        
        $fmt = "
        <event>
  		<hour>$start_time - $end_time</hour>
		<name>$title</name>
		<description>$description</description>
		</event>";
        return $fmt;
    }

    protected function _format_time($time) {
        $time = new DateTimeImmutable($time);
        $time = $time->format("H\hi");
        return $time;
    }

    protected function _format_title($title) {
        return $title;
    }

    protected function _format_description($description) {
        // To keep a space in case of HTML tag (might introduce unwanted spaces)
        $description = str_replace("<", " <", $description);

        // Remove most HTML tags
        $description = strip_tags($description, "<b><strong><i><em><u>");

        // Replace all types of spaces with a classic whitespace
        $description = preg_replace("/\s+/u", " ", $description);

        // Replace Unicode horizontal ellipsis with three separate dots
        $description = preg_replace("/…/u", "...", $description);

        // Remove horizontal lines "--------"
        $description = preg_replace("/\s+-*\s+/u", " ", $description);

        $description = trim($description);
        
        // Maximum number of characters
        $description = substr($description, 0, 250);

        // Keep only the complete sentences
        $res = preg_match(
            "/(^[\s\S]+[\.\?\!])(\s([^\.\!\?]|([\.\!\?][^\s]))*)?$/u",
            $description,
            $matches,
        );
        if($res)
            $description = $matches[1];
        
        return $description;
    }
}


$start_date = new DateTime("2024-03-04 00:00:00");
$end_date = clone($start_date);
$end_date->modify("+28 day");

$events = get_events_in_period($start_date, $end_date);
$events_per_week = group_events_per_day_per_week($events);

?>

<!DOCTYPE html>
<html>
  <head>
	<meta charset="utf-8"> 

	<link rel="stylesheet" href="style.css">
	
	<!-- Nécessaire pour wkhtmltopdf -->
	<style>
	  img.emoji {
		  height: 1em;
		  width: 1em;
		  /* margin: 0 .05em 0 .1em; */
		  vertical-align: -0.1em;
	  }
	</style>
	<script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js"></script>
    <script>window.onload = function () { twemoji.parse(document.body);}</script>
        

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
     
    <script>
     function createEditableTag(tag) {
        function tagClicked() {
            var divHtml = $(this).html();
            var editableText = $("<textarea />");
            editableText.val(divHtml);
            $(this).replaceWith(editableText);
            editableText.focus();
            // setup the blur event for this new textarea
            editableText.blur(editableTextBlurred);
        }
     
     function editableTextBlurred() {
         var html = $(this).val();
         var viewableText = $(tag);
         viewableText.html(html);
         $(this).replaceWith(viewableText);
         // setup the click event for this new div
         viewableText.click(tagClicked);
     }

            return tagClicked
            }

     $(document).ready(function() {
         $("name").click(createEditableTag("<name>"));
         $("description").click(createEditableTag("<description>"));
     });
    </script>

  </head>
  
  <body>

<?php
     $event_formatter = new EventFormatter();
        
     foreach($events_per_week as $week_events) {
         $date = new DateTime(current($week_events)[0]["start_date"]);
         $fmt = datefmt_create(
             "fr-FR",
             pattern: "LLLL",
         );
         $mois = datefmt_format($fmt, $date);

         ?>

     <page>

	  <header>
        <month><?php echo $mois; ?></month>

        <img src="imgs/internet-icon_blue.svg" style="width: 15px; height: 15px;" />
		quartiergenereux.fr
		<br>

		<img src="imgs/facebook-icon_blue.svg" style="width: 15px; height: 15px;" />
		<img src="imgs/instagram-icon_blue.svg" style="width: 15px; height: 15px;" />
		QG.montpellier
	  </header>

<?php
     foreach($week_events as $jour => $day_events) {
         $start_date = new DateTime($day_events[0]["start_date"]);
         $fmt = datefmt_create(
             "fr-FR",
             pattern: "EEEE",
         );
         $jour_semaine = datefmt_format($fmt, $start_date);
         
         echo "<day-events-block>
		<date-block>$jour_semaine <date>$jour</date></date-block>
";
         
         foreach($day_events as $event)
             echo $event_formatter->format($event);
         
         echo "</day-events-block>";
     }
?>

    </page>

<?php
          }
     ?>
    
    </body>
</html>
