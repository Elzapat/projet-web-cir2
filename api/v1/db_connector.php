<?php

include_once "constants.php";

class dbConnector {
    private $db;

    public function __construct() {
        // Connection à la base de données
        $this->db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME
                . ";charset=utf8", DB_USERNAME, DB_PASSWORD);
    }

    public function __destruct() {
        // Deconnexion de la base de données
        unset($db);
    }

    public function get_trips($start_date, $limit) {

    }

    public function add_user($first_name, $last_name, $password,
            $phone, $username) {

    }

    public function add_trip($creator, $price, $seats, $start_datetime,
            $end_datetime, $start_loc, $end_loc) {

    }

    public function add_passenger_to_trip($trip_id, $passenger) {

    }
}


?>
