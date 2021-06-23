<?php

function trips($request_method, $request) {
    try {
        $db = new dbConnector; 
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        send_response(null, 503);
    }

    switch ($request_method) {
        case "GET":
            if (!isset($_GET["date"]) || !isset($_GET["depart"]) || 
                    !isset($_GET["arrivee"]) || !isset($_GET["depart_isen"]))
                send_response(null, 400);
            $limit = isset($_GET["limit"]) ? $_GET["limit"] : MAX_TRIPS_RETRIEVE;
            if ($limit > MAX_TRIPS_RETRIEVE)
                $limit = MAX_TRIPS_RETRIEVE;

            $data = $db->get_trips($_GET["date"], $_GET["depart"],
                $_GET["arrivee"], $_GET["depart_isen"], $limit);
            send_response($data, 200);
        case "POST":
            $req = json_decode(file_get_contents("php://input"), true);

            if (isset($req["login"])) {
                $token_login = verify_token($db);
                if ($token_login != $req["login"])
                    send_response(null, 401);
            }

            if (isset($request[0]) && $request[0] == "passagers" &&
                    isset($req["id_trajet"])) {
                $data = $db->add_passenger_to_trip($req["id_trajet"], $req["login"]);
                send_response($data, $data ? 200 : 500);
            }

            if (!isset($req["login"]) || !isset($req["price"]) ||
                    !isset($req["nb_seats"]) || !isset($req["start_datetime"]) ||
                    !isset($req["end_datetime"]) || !isset($req["duration"]) ||
                    !isset($req["start_address"]) || !isset($req["end_address"]) ||
                    !isset($req["city"]) || !isset($req["isen"]) ||
                    !isset($req["isen_start"]))
                send_response(null, 400);

            $data = $db->add_trip($req["login"], $req["price"], $req["nb_seats"],
                $req["start_datetime"], $req["end_datetime"], $req["duration"],
                $req["start_address"], $req["end_address"], $req["city"],
                $req["isen"], $req["isen_start"]);
            send_response($data, $data ? 200 : 500);
        default:
            send_response(null, 400);
    }
}

?>
