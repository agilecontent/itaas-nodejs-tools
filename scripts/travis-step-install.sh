#!/bin/bash
set -ev

# Run a cassandra container
docker run --name cassandra -d -p 9042:9042 cassandra:3.0.9

#install dependences
npm install >/dev/null

# Wait for Cassandra initialization
until docker run --link cassandra:cassandra --rm cassandra:3.0.9 cqlsh cassandra 2>/dev/null 
do
  echo -n "."
  sleep 1
done
echo "."

#List running containers
docker ps
