
private var thisFireball : GameObject;
private var fireballTemperature : Temperature;

var numActiveFlares : int = 0;

function Start () {
	thisFireball = GameObject.Find("Fireball");
	fireballTemperature = thisFireball.GetComponent("Temperature");
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.FLARE_COUNT_CHANGED);
}

function OnTriggerEnter(collider : Collider){
	//Debug.Log("On Trigger Enter");
	var obj : GameObject = collider.gameObject;
	var tempChanger : TempChanger = obj.GetComponent("TempChanger");
	
	if(tempChanger != null && !tempChanger.used) {
	
		if(tempChanger.tempDiff < 0 && numActiveFlares > 0) {
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.FLARE_USED, numActiveFlares);
		} else {
			fireballTemperature.TempChange(tempChanger.tempDiff, true);
		}
		
		tempChanger.used = true;
		
		if(obj.audio) {
			obj.audio.Play();
		}
		
		if(tempChanger.isHeatGem) {
			thisFireball.audio.Play();
		}
		
		if(tempChanger.disableOnCollision) {
			obj.SetActiveRecursively(false);
		}
		
		var heatBarCollected : HeatBarCollected = obj.GetComponent("HeatBarCollected");
		
		if(heatBarCollected != null) {
			heatBarCollected.Trigger();
		}
		
	}

}

function OnFlareCountChange(notification : Notification) {
	numActiveFlares = notification.data;
}