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
            if (!isset($_GET["date"]) || !isset($_GET["depart"]) ||
                    !isset($_GET["arrivee"]) || !isset($_GET["depart_isen"]))
                send_response(null, 400);
            $limit = isset($_GET["limit"]) ? $_GET["limit"] : MAX_TRIPS_RETRIEVE;
            if ($limit > MAX_TRIPS_RETRIEVE)
                $limit = MAX_TRIPS_RETRIEVE;

            $data = $db->get_trips($_GET["date"], $_GET["depart"],
                $_GET["arrivee"], $_GET["depart_isen"], $limit);
            send_response($data, 200);
        default:
            send_response(null, 400);
    }
}

?>
