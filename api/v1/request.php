<?php

include_once "../../constants.php";
include_once "../../database/db_connector.php";
include_once "../../utils.php";
include_once "../../auth/verify_token.php";
include_once "ressources/users.php";
include_once "ressources/isen_locations.php";
include_once "ressources/trips.php";
include_once "ressources/cities.php";

// On récupère le lien après le fichier PHP et on retire le premier slash
$request = substr($_SERVER["PATH_INFO"], 1);
// On divise la requête en plusieurs parties
$request = explode("/", $request);

// La première partie est la ressource à laquelle le client veut accéder
$request_ressource = array_shift($request);
// La méthode la requête | GET, POST, PUT ou DELETE
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_ressource) {
    case "utilisateurs":
        users($request_method, $request);
    case "trajets":
        trips($request_method, $request);
    case "sites_isen":
        isen_locations($request_method);
    case "villes":
        cities($request_method, $request);
    default:
        send_response(null, 400);
}

?>
