<?php

include_once "utils.php";
include_once "../db_connector.php";
include_once "../constants.php";

function get_request($request_ressource) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 500);
    }

    switch ($request_ressource) {
        case "trips":
            if (!isset($_GET["start_date"]))
                send_response(null, 400);
            $limit = isset($_GET["limit"]) ? $_GET["limit"] : MAX_TRIPS_RETRIEVE;
            if ($limit > MAX_TRIPS_RETRIEVE)
                $limit = MAX_TRIPS_RETRIEVE;

            $data = $db->get_trips($_GET["start_date"], $limit);
            return $data;
        default:
            send_response(null, 400);
    }
}

?>
