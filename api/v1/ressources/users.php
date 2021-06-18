<?php

include_once "../../../utils.php";
include_once "../../../database/db_connector.php";
include_once "../../../constants.php";

function users($request_method) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "POST":
            if (!isset($_POST["first_name"]) || !isset($_POST["last_name"]) ||
                    !isset($_POST["password"]) || !isset($_POST["phone"]) ||
                    !isset($_POST["username"])) {
                send_response(null, 400); 
            }

            $data = $db->add_user($_POST["first_name"], $_POST["last_name"],
                $_POST["password"], $_POST["phone"], $_POST["username"]);

            send_response($data, $data ? 200 : 500);
        default:
            send_response(null, 400);
    }
}

?>
