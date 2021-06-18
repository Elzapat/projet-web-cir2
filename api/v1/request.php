<?php

include_once "utils.php";
include_once "requests/get_request.php"

// On récupère le lien après le fichier PHP et on retire le premier slash
$request = substr($_SERVER["PATH_INFO"], 1);
// On divise la requête en plusieurs parties
$request = explode("/", $request);

// La première partie est la ressource à laquelle le client veut accéder
$request_ressource = array_shift($request);
// La méthode la requête | GET, POST, PUT ou DELETE
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case "GET":
        get_request($request_ressource);
        break;
    case "PUT":
        break;
    case "POST":
        break;
    case "DELETE":
        break;
    default:
        send_response(null, 400);
}

?>
