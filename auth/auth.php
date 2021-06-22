<?php

include_once "../utils.php";
include_once "../database/db_connector.php";

$request = substr($_SERVER["PATH_INFO"], 1);
$request = explode('/', $request);
$request_ressource = array_shift($request);

try {
    $db = new dbConnector();
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    send_response(null, 503);
}

switch ($request_ressource) {
    case "authenticate":
        authenticate($db);
    default:
        send_response(null, 400);
}

function authenticate($db) {
    $username = $_SERVER["PHP_AUTH_USER"];
    $password = $_SERVER["PHP_AUTH_PW"];

    if (!$db->check_user_credentials($username, $password))
        send_response(null, 401);

    $token = base64_encode(openssl_random_pseudo_bytes(12));
    $db->add_user_token($username, $token);

    send_response($token, 200, "plain/text");
}

?>
