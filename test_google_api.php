<?php

// include your composer dependencies
require_once 'vendor/autoload.php';

define("API_KEY", "AIzaSyDL4YMF0baYwuwdsZVlB-DHSEXkfIpR4hQ");
define("CALENDAR_ID", "1a765f00b1b3157f7f659f5d0f7343cc9b27d1ece10523108b5adf9ff5f98c82@group.calendar.google.com");

$client = new Google\Client();
$client->setApplicationName("AgendaGenerator");
$client->setDeveloperKey(API_KEY);

$service = new Google\Service\Calendar($client);

$start_date = new DateTime("2024-03-04");
$end_date = clone($start_date);
$end_date->modify("+28 day");

$start_time = $start_date->format(DateTime::RFC3339);
$end_time = $end_date->format(DateTime::RFC3339);

$limit = 250;
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

foreach($events as $event) {
    $date = $event->getStart()->getDateTime();
    $title = $event->getSummary();
    $description = $event->getDescription();
    echo $date;
    echo "\n";
    echo $title;
    echo "\n";
    echo $description;
    $date = $event->getStart()->getDate();
    echo "\n\n";
}
