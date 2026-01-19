
CONTAINER=$(docker ps -q --filter publish=8088/tcp )
if [ -z "$CONTAINER" ]
then
	echo $CONTAINER
else
	echo "get logs container $CONTAINER"
	docker logs $CONTAINER
fi
