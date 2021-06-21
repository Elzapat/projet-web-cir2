<?php

include_once "../../utils.php";
include_once "../../constants.php";
include_once "../../database/db_connector.php";

function trips($request_method) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "GET":
            if (!isset($_GET["start_date"]))
                send_response(null, 400);
            $limit = isset($_GET["limit"]) ? $_GET["limit"] : MAX_TRIPS_RETRIEVE;
            if ($limit > MAX_TRIPS_RETRIEVE)
                $limit = MAX_TRIPS_RETRIEVE;

            $data = $db->get_trips($_GET["start_date"], $limit);
            send_response($data, 200);
        default:
            send_response(null, 400);
    }
}

?>
