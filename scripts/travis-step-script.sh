#!/bin/bash
set -ev

#Lint
npm run lint

#All tests
npm run test

#Coverage
npm run coverage

if [ "$TRAVIS_BRANCH" == "master" ]; then
    ./scripts/create-github-tag.sh
fi