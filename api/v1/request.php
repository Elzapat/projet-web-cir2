<?php

include_once $_SERVER["DOCUMENT_ROOT"] . "/api/v1/ressources/users.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/api/v1/ressources/trips.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/api/v1/ressources/isen_locations.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/utils.php";

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
        trips($request_method);
    case "sites_isen":
        isen_locations($request_method);
    default:
        send_response(null, 400);
}

?>
