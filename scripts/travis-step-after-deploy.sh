#!/bin/bash
set -eo pipefail

echo "starting creating tag"

APP_VERSION=$(cat package.json | grep -Po 'version\"\:[ ]*\"\K[0-9.]+')
REPOSITORY_NAME="itaas-nodejs-tools"

if [ -z $PR_BRANCH ]; then
    DESCRIPTION=""
else
  JIRA_KEY_NUMBER=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed 's/refs\/heads\///g' | grep -ioP '[[:digit:]]{4,}' | head -1)
  DESCRIPTION=$(echo "[ITAAS-$JIRA_KEY_NUMBER](https://jiralabone.atlassian.net/browse/ITAAS-$JIRA_KEY_NUMBER)")
fi

  curl \
    -X POST \
    -H 'Accept: application/vnd.github.v3+json' \
    -H "Authorization: token $GITHUB_OAUTH_TOKEN" \
    https://api.github.com/repos/agilecontent/$REPOSITORY_NAME/releases \
    -d '{"tag_name":"'$APP_VERSION'", "body":"'$DESCRIPTION'" }'
