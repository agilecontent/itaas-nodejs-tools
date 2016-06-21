#!/bin/bash
set -ev

docker run --name cassandra -d cassandra:2.2.6
docker ps

# Run a cassandra container
docker run --name cassandra -d -p 9042:9042 cassandra:2.2.6

#install dependences
npm install >/dev/null

#List running containers
docker ps
