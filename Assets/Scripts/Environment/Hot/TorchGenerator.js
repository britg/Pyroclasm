#pragma strict

var torch : GameObject;
private var torchPool : GameObjectPool;

function Start () {
	torchPool = GameObjectPool( torch, 2, true );
	torchPool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_TORCH);
}

function OnGenerateTorch (notification : Notification) {
	var x : int = notification.data;
	torchPool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}