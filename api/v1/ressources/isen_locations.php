<?php

include_once "../../../utils.php";
include_once "../../../database/db_connector.php";
include_once "../../../constants.php";

function isen_locations($request_method) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "GET":
            $data = $db->get_isen_locations();
            send_response($data, $data ? 200 : 500);
        default:
            send_response(null, 400);
    }
}

?>
