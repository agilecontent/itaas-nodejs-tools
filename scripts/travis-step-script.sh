#!/bin/bash
set -ev

#Lint
npm run lint

#All tests
npm run test

#Coverage
npm run coverage
