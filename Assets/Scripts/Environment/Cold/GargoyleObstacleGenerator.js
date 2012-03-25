#pragma strict

var gargoyleObstacle : GameObject;
private var gargoyleObstaclePool : GameObjectPool;

function Start () {
	gargoyleObstaclePool = GameObjectPool( gargoyleObstacle, 2, true );
	gargoyleObstaclePool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_GARGOYLE_OBSTACLE);
}

function OnGenerateGargoyleObstacle (notification : Notification) {
	var x : float = notification.data;
	gargoyleObstaclePool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}