#!/bin/bash
set -euo pipefail

APP_VERSION=$(cat package.json | grep -Po 'version\"\:[ ]*\"\K[0-9.]+')

if [ "${TRAVIS_EVENT_TYPE:-}" == "pull_request" ] 
then
  JIRA_KEY_NUMBER=$(echo $TRAVIS_PULL_REQUEST_BRANCH| sed 's/refs\/heads\///g' | grep -ioP '[[:digit:]]{4,}' | head -1)
  DESCRIPTION=$(echo "[ITAAS-$JIRA_KEY_NUMBER](https://jiralabone.atlassian.net/browse/ITAAS-$JIRA_KEY_NUMBER)")

  curl \
    -X POST \
    -H 'Accept: application/vnd.github.v3+json' \
    -H "Authorization: token $GITHUB_OAUTH_TOKEN" \
    https://api.github.com/repos/agilecontent/itaas-nodejs-tools/releases \
    -d '{"tag_name":"'$TRAVIS_APP_VERSION'", "body":"'$DESCRIPTION'" }'
else
  echo Skipping Github Release...
fi
