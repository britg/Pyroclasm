#pragma strict

var iceshard : GameObject;
private var iceshardPool : GameObjectPool;

function Start () {
	iceshardPool = GameObjectPool( iceshard, 2, true );
	iceshardPool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_ICESHARDS);
}

function OnGenerateIceShards (notification : Notification) {
	var x : float = notification.data;
	iceshardPool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}