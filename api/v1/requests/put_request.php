<?php

include_once "utils.php";
include_once "../db_connector.php";
include_once "../constants.php";

function put_request($request_ressource) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 500);
    }

    switch ($request_ressource) {
        default:
            send_response(null, 400);
    }
}

?>
