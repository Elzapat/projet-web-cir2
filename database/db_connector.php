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

    public function get_isen_locations() {
        try {
            $request = "SELECT v.nom FROM ville v
                        JOIN site_isen s ON v.code_insee = s.code_insee";
            $stmt = $this->db->prepare($request);
            $stmt->execute();
            $result = $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Request error . " $e->getMessage());
            return false;
        }

        return isset($result) ? $result : false;
    }

    public function add_user($first_name, $last_name, $password,
            $phone, $username) {
        try {
            $request = "INSERT INTO utilisateur VALUES
                    (pseudo, nom, prenom, mot_de_passe, num_tel, jeton_auth)
                    (:pseudo, :nom, :prenom, sha1(:mdp), :num_tel, NULL)";  
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":pseudo", $username, PDO::PARAM_STR, 25):
            $stmt->bindParam(":nom", $last_name, PDO::PARAM_STR, 100):
            $stmt->bindParam(":prenom", $first_name, PDO::PARAM_STR, 100):
            $stmt->bindParam(":mpd", $password, PDO::PARAM_STR, 40):
            $stmt->bindParam(":num_tel", $phone, PDO::PARAM_STR, 20):
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return true;
    }

    public function add_trip($creator, $price, $seats, $start_datetime,
            $end_datetime, $start_loc, $end_loc) {

    }

    public function add_passenger_to_trip($trip_id, $passenger) {

    }

    public function check_user_credentials($username, $password) {
        try {
            $request = "SELECT * FROM utilisateur WHERE pseudo=:username AND
                    password=sha1(:password)";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":pseudo", $username, PDO::PARAM_STR, 20);
            $stmt->bindParam(":password", $password, PDO::PARAM_STR, 40);
            $stmt->execute();
            $result = $statement->fetch();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return isset($result);
    }

    public function add_user_token($username, $token) {
        try {
            $request = "UPDATE utilsateur SET jeton_auth=:token WHERE pseudo=:username";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":token", $token, PDO::PARAM_STR, 20);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR, 20);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return true;
    }

    public function verify_user_token($token) {
        try {
            $request = "SELECT pseudo FROM utilisateur WHERE jeton_auth=:token";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":token", $token, PDO::PARAM_STR, 20);
            $stmt->execute();
            $result = $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Request error:" . $e->getMessage());
            return false;
        }

        return isset($result) ? $result["pseudo"] : false;
    }
}


?>
