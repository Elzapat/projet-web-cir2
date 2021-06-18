<?php

include_once "utils.php";
include_once "../../../database/db_connector.php";
include_once "../constants.php";

function post_request($request_ressource) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_ressource) {
        case "users":
            if (!isset($_POST["first_name"]) || !isset($_POST["last_name"]) ||
                    !isset($_POST["password"]) || !isset($_POST["phone"]) ||
                    !isset($_POST["username"])) {
                send_response(null, 400); 
            }

            $data = $db->add_user($_POST["first_name"], $_POST["last_name"],
                            $_POST["password"], $_POST["phone"], $_POST["username"]);
            return $data;
        default:
            send_response(null, 400);
    }
}

?>
