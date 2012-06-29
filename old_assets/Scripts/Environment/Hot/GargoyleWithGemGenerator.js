#pragma strict

var gargoyleWithGem : GameObject;
private var gargoyleWithGemPool : GameObjectPool;

function Start () {
	gargoyleWithGemPool = GameObjectPool( gargoyleWithGem, 2, true );
	gargoyleWithGemPool.PrePopulate(2);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GENERATE_GARGOYLE_BONUS);
}

function OnGenerateGargoyleBonus (notification : Notification) {
	var x : float = notification.data;
	gargoyleWithGemPool.Spawn(Vector3(x, 3.5, -1), Quaternion.identity);
}

function Update () {

}