<?php

function send_response($data, $code, $type = "application/json") {
    $messages = array(
        200 => "OK",
        400 => "Bad Request",
        401 => "Unauthorized",
        500 => "Internal Server Error",
        503 => "Service Unavailable"
    );

    // Request headers
    header("Content-Type: $type; charset=utf8");
    header("Cache-control: no-store, no-cache, must-revalidate");
    header("Pragma: no-cache");
    header("HTTP/1.1 $code " . $messages[$code]);

    // If the data isn't set, exit without sending data
    if (!isset($data))
        exit;

    // If the data type is JSON, send the data as JSON
    if (str_contains($type, "json"))
        echo json_encode($data)
    else
        echo $data;

    exit;
}

?>
