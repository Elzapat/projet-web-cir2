<?php

function send_response($data, $code) {
    $messages = array(
        200 => "OK",
        400 => "Bad Request",
        500 => "Internal Server Error"
    );

    // Headers de la requête
    header("Content-Type: application/json; charset=utf8");
    header("Cache-control: no-store, no-cache, must-revalidate");
    header("Pragma: no-cache");
    header("HTTP/1.1 $code " . $messages[$code]);

    // Si les données existent, elles sont encodées en JSON et envoyées au client
    if (isset($data))
        echo json_encode($data);

    exit;
}

?>
