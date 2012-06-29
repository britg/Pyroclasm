#pragma strict

var tapestry : GameObject;
private var tapestryPool : GameObjectPool;

function Start () {
	tapestryPool = GameObjectPool( tapestry, 2, true );
	tapestryPool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_TAPESTRY);
}

function OnGenerateTapestry (notification : Notification) {
	var x : float = notification.data;
	tapestryPool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}