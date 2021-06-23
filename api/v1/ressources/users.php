<?php

function users($request_method, $request) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "GET":
            if ($request[0] == pseudo && isset($request[1])) {
                $data = $db->check_username_existence($request[1]);
                send_response($data, isset($data) ? 200 : 400);
            } else if ( isset($request[0]) ) {
                $data = $db->get_user_infos($request[0]);
                send_response($data, isset($data) ? 200 : 400);
            } else {
                send_response(null, 400);
            }
        case "POST":
            $req = json_decode(file_get_contents("php://input"), true);
            if (!isset($req["first_name"]) || !isset($req["last_name"]) ||
                    !isset($req["password"]) || !isset($req["phone"]) ||
                    !isset($req["username"])) {
                send_response(null, 400); 
            }

            $data = $db->add_user($req["first_name"], $req["last_name"],
                $req["password"], $req["phone"], $req["username"]);

            send_response($data, $data ? 200 : 500);
        default:
            send_response(null, 400);
    }
}

?>
