<?php

function cities($request_method, $request) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "GET":
            if (!isset($request[0]))
                send_response(null, 400);
            $data = $db->get_city_info($request[0]);
            send_response($data, $data != null ? 200 : 400);
    }
}

?>
