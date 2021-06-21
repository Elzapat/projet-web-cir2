INSERT INTO site_isen (code_insee, adresse, nom)
VALUES
("29019", "20, rue Cuirassé Bretagne", "ISEN Brest"),
("35238", "2, rue de la Châtaigneraie", "ISEN Rennes"),
("59350", "41, boulevard Vauban", "ISEN Lilles"),
("44109", "35, avenue du Champ de Manœuvre", "ISEN Nantes"),
("14118", "8, avenue Croix Guérin", "ISEN Caen"),
("83137", "place Georges Pompidou", "ISEN Toulon");

INSERT INTO utilisateur (pseudo, prenom, nom, mot_de_passe, num_tel, jeton_auth)
VALUES
("Benoit0298", "Benoit", "Lorcy", "e8126c64c3486e84081fffad6a0ab22d4267bb41", "0780829382", NULL),
("aragorgne", "Noam", "Nedelec-Salmon", "e392bfdc5c80cde822c62ca8befa552368ff3701", "0792749823", NULL),
("WaBtey", "Florian", "Epain", "6a6e5dbc8b86513815fbd3f795e18718f3627b6e", "0683949294", NULL),
("Elzapat", "Morgan", "Van Amerongen", "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3", "O768886995", NULL);

INSERT INTO trajet (adresse_depart, adresse_arrivee, duree_trajet, date_depart, date_arrivee, prix, nb_places_restantes, nb_places, depart_isen, pseudo, code_insee, code_insee_site_isen)
VALUES
("36, rue de Carnel", "20, rue Cuirassé Bretagne", "01:30:00", "2021-05-29 10:00:00", "2021-05-29 11:30:00", 7.50, 3, 3, FALSE, "Elzapat", "56121", "29019"),
("10, rue Georges Borgne", "2, rue de la Châtaigneraie", "01:45:00", "2021-06-29 16:00:00", "2021-05-29 17:45:00", 11.50, 4, 4, FALSE, "Elzapat", "56121", "35238");
