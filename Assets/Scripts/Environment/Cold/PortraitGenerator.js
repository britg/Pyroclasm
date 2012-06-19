#pragma strict

var portrait : GameObject;
private var portraitPool : GameObjectPool;

function Start () {
	portraitPool = GameObjectPool( portrait, 2, true );
	portraitPool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_PORTRAIT);
}

function OnGeneratePortrait (notification : Notification) {
	var x : float = notification.data;
	portraitPool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}