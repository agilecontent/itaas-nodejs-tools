#!/bin/bash
set -ev

#Lint
npm run lint

#All tests
npm run test

#Coverage
npm run coverage

echo "TRAVIS_BRANCH -> $TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" == "master" ]; then
    ./scripts/create-github-tag.sh
fi

