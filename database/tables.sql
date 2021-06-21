#------------------------------------------------------------
# Table: utilisateur
#------------------------------------------------------------

CREATE TABLE utilisateur(
        pseudo       Varchar (25) NOT NULL ,
        nom          Varchar (100) NOT NULL ,
        prenom       Varchar (100) NOT NULL ,
        mot_de_passe Varchar (40) NOT NULL ,
        num_tel      Varchar (20) NOT NULL ,
        jeton_auth   Varchar (20)
	,CONSTRAINT utilisateur_PK PRIMARY KEY (pseudo)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: ville
#------------------------------------------------------------

CREATE TABLE ville(
        code_insee  Varchar (20) NOT NULL ,
        nom         Varchar (100) NOT NULL ,
        code_postal Int NOT NULL ,
        coord_gps   Varchar(40)
	,CONSTRAINT ville_PK PRIMARY KEY (code_insee)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: site_isen
#------------------------------------------------------------

CREATE TABLE site_isen(
        code_insee Varchar (20) NOT NULL ,
        adresse    Varchar (255) NOT NULL ,
        nom        Varchar (50) NOT NULL
	,CONSTRAINT site_isen_PK PRIMARY KEY (code_insee)
	,CONSTRAINT site_isen_ville_FK FOREIGN KEY (code_insee) REFERENCES ville(code_insee)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: trajet
#------------------------------------------------------------

CREATE TABLE trajet(
        id_trajet            Int  Auto_increment  NOT NULL ,
        adresse_depart       Varchar (255) NOT NULL ,
        adresse_arrivee      Varchar (255) NOT NULL ,
        duree_trajet         Time NOT NULL ,
        date_depart          Datetime NOT NULL ,
        date_arrivee         Datetime NOT NULL ,
        prix                 Float NOT NULL ,
        nb_places_restantes  TinyINT NOT NULL ,
        nb_places            TinyINT NOT NULL ,
        depart_isen          Bool NOT NULL ,
        pseudo               Varchar (25) NOT NULL ,
        code_insee           Varchar (20) NOT NULL ,
        code_insee_site_isen Varchar (20) NOT NULL
	,CONSTRAINT trajet_PK PRIMARY KEY (id_trajet)
	,CONSTRAINT trajet_utilisateur_FK FOREIGN KEY (pseudo) REFERENCES utilisateur(pseudo)
	,CONSTRAINT trajet_ville0_FK FOREIGN KEY (code_insee) REFERENCES ville(code_insee)
	,CONSTRAINT trajet_site_isen1_FK FOREIGN KEY (code_insee_site_isen) REFERENCES site_isen(code_insee)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: passager_trajet
#------------------------------------------------------------

CREATE TABLE passager_trajet(
        id_trajet Int NOT NULL ,
        pseudo    Varchar (25) NOT NULL
	,CONSTRAINT passager_trajet_PK PRIMARY KEY (id_trajet,pseudo)
	,CONSTRAINT passager_trajet_trajet_FK FOREIGN KEY (id_trajet) REFERENCES trajet(id_trajet)
	,CONSTRAINT passager_trajet_utilisateur0_FK FOREIGN KEY (pseudo) REFERENCES utilisateur(pseudo)
)ENGINE=InnoDB;
