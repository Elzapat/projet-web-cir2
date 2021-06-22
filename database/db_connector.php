<?php

include_once "../../constants.php";

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

    public function get_trips($date, $start, $end, $isen_start, $limit) {
        try {
            $request = "SELECT t.id_trajet, t.depart_isen, v.nom AS 'ville',
                            i.nom AS 'isen', t.duree_trajet, t.date_depart,
                            t.date_arrivee, t.prix, t.nb_places_restantes, t.pseudo
                        FROM trajet t
                        JOIN ville v ON t.code_insee = v.code_insee
                        JOIN site_isen i ON t.code_insee_site_isen = i.code_insee
                        WHERE v.nom = :city AND i.nom = :isen_loc
                            AND DATE(t.date_depart) <= :date
                            AND DATE_ADD(DATE(t.date_depart), INTERVAL 7 DAY) >= :date
                        LIMIT :limit";
            $city = $isen_start ? $end : $start;
            $isen = $isen_start ? $start : $end;

            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":city", $city, PDO::PARAM_STR, 100);
            $stmt->bindParam(":isen_loc", $isen, PDO::PARAM_STR, 100);
            $stmt->bindParam(":date", $date, PDO::PARAM_STR, 20);
            $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return $result;
    }

    public function get_isen_locations() {
        try {
            $request = "SELECT nom FROM site_isen";
            $stmt = $this->db->prepare($request);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Request error" . $e->getMessage());
            return false;
        }

        return isset($result) ? $result : false;
    }

    public function add_user($first_name, $last_name, $password,
            $phone, $username) {
        try {
            $request = "INSERT INTO utilisateur 
                    (pseudo, nom, prenom, mot_de_passe, num_tel, jeton_auth) VALUES
                    (:pseudo, :nom, :prenom, SHA1(:mdp), :num_tel, NULL)";  
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":pseudo", $username, PDO::PARAM_STR, 25);
            $stmt->bindParam(":nom", $last_name, PDO::PARAM_STR, 100);
            $stmt->bindParam(":prenom", $first_name, PDO::PARAM_STR, 100);
            $stmt->bindParam(":mdp", $password, PDO::PARAM_STR, 40);
            $stmt->bindParam(":num_tel", $phone, PDO::PARAM_STR, 20);
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
            $request = "SELECT pseudo FROM utilisateur WHERE pseudo=:username AND
                    mot_de_passe=sha1(:password)";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR, 20);
            $stmt->bindParam(":password", $password, PDO::PARAM_STR, 40);
            $stmt->execute();
            $result = $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return $result;
    }

    public function add_user_token($username, $token) {
        try {
            $request = "UPDATE utilisateur SET jeton_auth=:token WHERE pseudo=:username";
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
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return isset($result) ? $result["pseudo"] : false;
    }

    public function check_username_existence($username) {
        try {
            $request = "SELECT pseudo FROM utilisateur WHERE pseudo=:username";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return null;
        }

        return $result != null;
    }
}


?>
