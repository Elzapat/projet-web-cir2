# projet-web-cir2
Projet de fin d'année par Morgan Van Amerongen & Yohann LE CAM en CIR 2 à l'ISEN Brest.

https://github.com/Elzapat/projet-web-cir2

## Projet

Site de covoiturage partant ou allant à un site de l'ISEN en France.
Fonctionnalités :
* rechercher un trajet en fonction du lieu de départ et d'arrivée
* publier un trajet (uniquement si on est inscrit)
 * adresse de départ et d'arrivée
 * date et heure de départ
 * nombre de places (0 à 10)
 * prix (0 à 100€)
* s'inscire, se connecter, se déconnecter
* calcul de l'heure d'arrivée en fonction des villes de départ/arrivée et de l'heure de départ
* page récapitulative des informations utilisateurs (pseud, nom, prénom, numéro)

##Installation de l'application
L'application repose sur un serveur web tel que Apache et une base de donnée MySQL/MariaDB.
Pour se connecter à la base de données, les informations de connexions sont dans `constants.php` et peuvent être changés si besoin.
Les scripts SQL pour déployer la base de données sont sous le dossier `database/`. Les scrips SQL sont à être utilisés dans cette ordre :
* `tables.sql` permet de crééer toutes les tables
* `populate_cities.sql` permet de rentrer les données pour la table ville
* `populate_tables.sql` permet de rentrer les données pour les autres tables

##Documents demandés

* Les schémas MCD et MPD sont dans le fichier `database/mcd_mpd/`
* Les ressources sont dans `public/images/`
* Les scripts SQL dans `database/`.


##Authentification

L'authentification se fait grâce au protocole OAuth2 implémenté en PHP.
L'identifiant de connexion est le pseudo.

##API

`GET /api/v1/request.php/utilisateurs/pseudo/<username>`
Renvoie true ou false pour savoir si l'utilisateur "username" existe dans la base

`GET /api/v1/request.php/utilisateurs/<username>`
Renvoie les informations liées au compte "username"

`GET /api/v1/request.php/trajets?date=<>&depart=<>&arrivee=<>&depart_isen=<>`
Recherche d'un trajet par sa date, son point de départ et d'arrivée

`POST /api/v1/request.php/trajets/passagers`
Permet de gérer le nombre de passage d'un trajet

`GET /api/v1/request.php/villes/<city>`
Renvoie les informations liées à la ville "city"

`POST /api/v1/request.php/trajets&pleindeparametres`
Création d'un trajet

`GET /api/v1/request.php/sites_isen`
Liste des sites de l'ISEN

...et plus encore

##Bugs connus
Il y a certains bugs que nous n'avons pas eu le temps de corriger, les voicis :
* La publication d'un trajet va parfois (Nous n'avons pas réussi a trouver de conditions pour laquelle ca marche ou pas, très frustrant) échouer sans donner aucune erreur, rendent ce bug très difficile à pister.
* La recherche de trajets qui partent de l'ISEN va parfois échouer.
* Le calcul de durée du trajet n'est pas fonctionelle, il y a eu tentative de le faire avec l'API que Mr Napoléon a partagé, comme j'avais les coordonnées GPS a disposition, mais on a manqué de temps.
