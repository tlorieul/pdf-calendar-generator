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

function group_events_per_week($events) {
    $i = 0;
    $events_per_week = [];
    foreach($events as $event) {
        $week_number = (new DateTime($event["start_date"]))->format("W");
        
        if(!array_key_exists($week_number, $events_per_week))
            $events_per_week[$week_number] = [];

        $events_per_week[$week_number][] = $event;
    }

    return $events_per_week;
}

$start_date = new DateTime("2024-03-04 00:00:00");
$end_date = clone($start_date);
$end_date->modify("+28 day");

$events = get_events_in_period($start_date, $end_date);
$events_per_week = group_events_per_week($events);


// TODO
$mois = "Mars";


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

  </head>
  
  <body>

<?php
     foreach($events_per_week as $events) {
         ?>

     <page>

	  <header>
        <mois><?php echo $mois; ?></mois>

        <img src="imgs/internet-icon_blue.svg" style="width: 15px; height: 15px;" />
		quartiergenereux.fr
		<br>

		<img src="imgs/facebook-icon_blue.svg" style="width: 15px; height: 15px;" />
		<img src="imgs/instagram-icon_blue.svg" style="width: 15px; height: 15px;" />
		QG.montpellier
	  </header>

<?php
     foreach($events as $event) {
         $start_date = new DateTimeImmutable($event["start_date"]);
         $end_date = new DateTimeImmutable($event["end_date"]);
         
         $jour = $start_date->format("d");
         $heure_debut = $start_date->format("H\hi");
         
         $fmt = datefmt_create(
             "fr-FR",
             pattern: "EEEE",
         );
         $jour_semaine = datefmt_format($fmt, $start_date);

         $heure_fin = $end_date->format("H\hi");;

         $description = $event["description"];
         $description = strip_tags($description, "<b><strong><i><em><u>");
         $description = substr($description, 0, 250);
         
         echo "
             <div>
		<date>$jour_semaine <jour>$jour</jour></date>
		<heure>$heure_debut - $heure_fin</heure>
		<h1>", $event["title"], "</h1>
 ", $description, "
	  </div>";
     }
?>

    </page>

<?php
          }
     ?>
    
    </body>
</html>
