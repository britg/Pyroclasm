#pragma strict

var bookcase : GameObject;
private var bookcasePool : GameObjectPool;

function Start () {
	bookcasePool = GameObjectPool( bookcase, 2, true );
	bookcasePool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_BOOKCASE);
}

function OnGenerateBookcase (notification : Notification) {
	var x : float = notification.data;
	Debug.Log("x is " + x);
	bookcasePool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}