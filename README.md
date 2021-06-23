# projet-web-cir2
Projet de fin d'année par Morgan Van Amerongen & Yohann LE CAM en CIR 2 à l'ISEN Brest.


-------------- Projet --------------

Site de covoiturage partant ou allant à un site de l'ISEN en France.
Fonctionnalités :
    - rechercher un trajet en fonction du lieu de départ et d'arrivée
    - publier un trajet (uniquement si on est inscrit)
        - adresse de départ et d'arrivée
        - date et heure de départ
        - nombre de places (0 à 10)
        - prix (0 à 100€)
    - s'inscire, se connecter, se déconnecter
    - calcul de l'heure d'arrivée en fonction des villes de départ/arrivée et de l'heure de départ
    - page récapitulative des informations utilisateurs (pseud, nom, prénom, numéro)


-------- Documents demandés --------

Les schémas MCD et MPD sont dans le fichier "databse" puis "mcd_mdp".
Les ressources sont dans "public" puis "images".
Les scripts SQL dans "database".


--------- Authentification ---------

L'authentification se fait grâce aux cookies.
L'identifiant de connexion est le pseudo.

---------------- API ---------------

../api/v1/request.php/utilisateurs/pseudo/${username}  (GET)
renvoie true ou false pour savoir si l'utilisateur "username" existe dans la base

../api/v1/request.php/utilisateurs/${username}  (GET)
renvoie les informations liées au compte "username"

../api/v1/request.php/trajets?date=${date}
&depart=${start_ISEN ? isen : city}
&arrivee=${start_ISEN ? city : isen}
&depart_isen=${start_ISEN ? 1 : 0}
----- MORGAN : search_trip.js ligne 96 -----

../api/v1/request.php/trajets/passagers  (POST)
permet de gérer le nombre de passage d'un trajet

../api/v1/request.php/villes/${city}  (GET)
renvoie les informations liées à la ville "city"

../api/v1/request.php/trajets  (POST)
----- MORGAN : publish.js ligne 137 -----

../api/v1/request.php/sites_isen  (GET)
liste des sites de l'ISEN

