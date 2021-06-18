<?php

include_once "../database/db_connector.php";
include_once "../api/v1/utils.php";

$request = substr($_SERVER["PATH_INFO"], 1);
$request = explode('/', $request);
$request_ressource = array_shift($request);

try {
    $db = new dbConnector();
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    send_reponse(null, 503);
}

switch ($request_ressource) {
    case "authenticate":
        authenticate($db);
    case "login":
        $login = verify_token($db);
        send_reponse($login, 200, "plain/text");
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

    send_reponse($token, 200, "plain/text");
}

function verify_token($db) {
    $headers = getallheaders();
    $token = $headers["Authorization"];

    if (preg_match("/Bearer (.*)/", $token, $tab))
        $token = $tab[1]

    $login = $db->verify_user_token($token);
    if (!$login)
        send_response(null, 401);

    return $login;
}

?>
