#!/bin/bash
set -ev

# Run a cassandra container
docker run --name cassandra -d -p 9042:9042 cassandra:3.0.9

#install dependences
npm install >/dev/null

#List running containers
docker ps
