git pull
docker build -t ms-qdc .
CONTAINER=$(docker ps -q --filter publish=8088/tcp )
if [ -z "$CONTAINER" ]
then
	echo $CONTAINER
else
	echo "stoping container $CONTAINER"
	docker stop $CONTAINER
	echo "removing container $CONTAINER"
	docker rm $CONTAINER
fi


echo "running ms-qdc"
docker run -dp 8088:8080 --restart always ms-qdc