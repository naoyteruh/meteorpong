# Meteor Pong

## Introduction

Ceci est un projet de découverte de meteor via le développement d'un jeu de type "pong". 

A ce jour une version est déployée sur Google Cloud Platform (App engine) [ici](https://meteorpong.ew.r.appspot.com/).

## Installation

Clonez le repo `git clone https://github.com/naoyteruh/meteorpong.git`

Allez sous le repo cloné

Lancez la commande `meteor`

Naviguez sous `http://localhost:3000/`

## Déploiement GCP

Créez un projet <PROJECT_NAME> dans GCP

Activez la facturation

Créez un cluster Mongo Atlas gratuit

https://cloud.mongodb.com/v2/5f6baa71b1da2e114b2f1f88#clusters

Créez une connection :
- Acces depuis n'importe ou (whitelist)
- Créez un utilisateur

Installez/Lancez Google Cloud SDK prompt sur votre ordinateur

Allez à la racine de votre projet

Vérifiez le projet courant `gcloud config list`

Changez vers le projet créé précedemment `gcloud config set project <PROJECT_NAME>`

Dans le fichier app.yaml :
- Mettez à jour METEOR_URL avec l'url fournie par Mongo Atlas
- Mettez à jour ROOT_URL avec l'url racine ou GCP deploit votre application

Lancez la commande `npm run deploy`
