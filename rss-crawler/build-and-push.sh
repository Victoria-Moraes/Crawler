export REGISTRY_TOKEN=5Jr-91sBlNbJuKWtV97wbqvAjj_1efkMPZrMABVlhBQG
export REGISTRY_URL=us.icr.io
export REGISTRY_USER=iamapikey
export REGISTRY_NAMESPACE=oi-wholesale-churn
export IMAGE_NAME=rss-crawler
export IMAGE_TAG=1.1

docker build -f ./Dockerfile -t ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} .
docker login -u ${REGISTRY_USER} -p ${REGISTRY_TOKEN} ${REGISTRY_URL}
docker push ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}