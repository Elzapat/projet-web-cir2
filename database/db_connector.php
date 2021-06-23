<?php

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

    public function add_trip($creator, $price, $nb_seats, $start_datetime,
            $end_datetime, $duration, $start_address, $end_address, $city, $isen,
            $isen_start) {
        var_dump($isen_start);
        try {
            $request = "INSERT INTO trajet (adresse_depart, adresse_arrivee,
                            duree_trajet, date_depart, date_arrivee,
                            prix, nb_places_restantes, nb_places, depart_isen,
                            pseudo, code_insee, code_insee_site_isen)
                        VALUES
                        (:start_address, :end_address, :duration, :start_datetime,
                        :end_datetime, :price, :nb_seats, :nb_seats, :isen_start,
                        :creator, :start, :end)";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":start_address", $start_address, PDO::PARAM_STR, 255);
            $stmt->bindParam(":end_address", $end_address, PDO::PARAM_STR, 255);
            $stmt->bindParam(":duration", $duration, PDO::PARAM_STR, 10);
            $stmt->bindParam(":start_datetime", $start_datetime, PDO::PARAM_STR, 20);
            $stmt->bindParam(":end_datetime", $end_datetime, PDO::PARAM_STR, 20);
            $stmt->bindParam(":price", $price, PDO::PARAM_STR, 10);
            $stmt->bindParam(":nb_seats", $nb_seats, PDO::PARAM_INT);
            $stmt->bindParam(":isen_start", $isen_start, PDO::PARAM_INT);
            $stmt->bindParam(":creator", $creator, PDO::PARAM_STR, 25);
            $start = $isen_start == 1 ? $isen : $city;
            $end = $isen_start == 1 ? $city : $isen;
            $stmt->bindParam(":start", $start, PDO::PARAM_STR, 100);
            $stmt->bindParam(":end", $end, PDO::PARAM_STR, 100);
            $stmt->execute();
            var_dump($stmt);
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return true;
    }

    public function add_passenger_to_trip($trip_id, $passenger) {
        try {
            $request = "INSERT INTO passager_trajet (id_trajet, pseudo)
                        VALUES (:trip_id, :passenger)";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":trip_id", $trip_id, PDO::PARAM_INT);
            $stmt->bindParam(":passenger", $passenger, PDO::PARAM_STR, 25);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return true;
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
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return isset($result) && !empty($result) ? $result[0]["pseudo"] : false;
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

    public function get_user_infos($username) {
        try {
            $request = "SELECT prenom, nom, num_tel FROM utilisateur WHERE pseudo=:username";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR, 25);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return false;
        }

        return isset($result) ? $result : false;
    }

    public function get_city_info($name) {
        try {
            $request = "SELECT * FROM ville
                        WHERE nom LIKE :query";
            $stmt = $this->db->prepare($request);
            $stmt->bindParam(":query", $name, PDO::PARAM_STR, 100);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Request error: " . $e->getMessage());
            return null;
        }

        return isset($result) && count($result) > 0 ? $result[0] : false;
    }
}


?>
