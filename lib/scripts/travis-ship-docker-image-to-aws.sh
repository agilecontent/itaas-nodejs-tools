#!/bin/bash
# Ship the docker image created in travis to docker private repo
# parameters:
#   DOCKER_IMAGE: docker image name you have created, e.g., uux/spotlight
#   BRANCH: the branch this build is being done, e.g, master, dev, release_sprint61, TM-4135_diego_MyAwesomeFeature
#   COMMIT_MESSAGE: commit message, used to check if it contains PUSH_DOCKER_IMAGE
#   DOCKER_REPOSITORY_URL: URL of docker repository
#   IS_PULL_REQUEST: if this build was started by a pull request

set -e

DOCKER_IMAGE=$1
DOCKER_REPOSITORY_URL=$2
BRANCH=$3
COMMIT_MESSAGE=$4
IS_PULL_REQUEST=$5

# Push the docker image
# Only when it is not a pull request
if [ "${IS_PULL_REQUEST}" == "false" ]; then
  # Get the commit message
  GIT_MESSAGE=$(git log -n 1 --pretty=%B)
  
  # Only when in 'master'
  # Or when branch has prefix 'release'
  # Or when commit message contains 'PUSH_DOCKER_IMAGE'
  if [ "${BRANCH}" == "master" ] || [[ "${BRANCH}" == release* ]] || [[ "${COMMIT_MESSAGE}" == *PUSH_DOCKER_IMAGE* ]]; then
    # Get app version from package.json > version
    APP_VERSION=$(cat package.json | grep -Po 'version\"\:[ ]*\"\K[0-9.]+')
    
	# Tag with release pattern when in branch master
    if [ "${BRANCH}" == "master" ]; then
      DOCKER_IMAGE_TAG=${APP_VERSION}.${COMMIT_MESSAGE}
    else
	  # Tag with beta release pattern when others branches
      DOCKER_IMAGE_TAG=${APP_VERSION}-beta.${BRANCH}.${COMMIT_MESSAGE}
    fi
	
    docker tag ${DOCKER_IMAGE} ${DOCKER_REPOSITORY_URL}:${DOCKER_IMAGE_TAG}
    docker push ${DOCKER_REPOSITORY_URL}:${DOCKER_IMAGE_TAG}
  fi
fi
