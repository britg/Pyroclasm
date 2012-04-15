
private var thisFireball : GameObject;
private var fireballTemperature : Temperature;
private var explosionPowerUpEmitter : ParticleEmitter;

var numActiveFlares : int = 0;

function Start () {
	thisFireball = GameObject.Find("Fireball");
	fireballTemperature = thisFireball.GetComponent("Temperature");
	explosionPowerUpEmitter = thisFireball.transform.Find("ExplosionPowerUp").GetComponent.<ParticleEmitter>();
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.FLARE_COUNT_CHANGED);
}

function OnTriggerEnter (collider : Collider) {

	var obj : GameObject 			= collider.gameObject;
	var tempChanger : TempChanger 	= obj.GetComponent("TempChanger");
	
	if(tempChanger == null || tempChanger.used)
		return;
		
	tempChanger.used = true;
		
	// Powerdown with a flare active
	if(tempChanger.tempDiff < 0) {
		if(numActiveFlares > 0) {
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.FLARE_USED, numActiveFlares);
		} else {
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ICE_COLLISION);
			fireballTemperature.TempChange(tempChanger.tempDiff, true);
		}
	} else {
		fireballTemperature.TempChange(tempChanger.tempDiff, true);
		
		if(tempChanger.isHeatGem) {
			thisFireball.audio.Play();
		} else {
			ShowExplosionPowerUp();
		}
	}
	
	if(obj.audio) {
		obj.audio.Play();
	}
	
	if(tempChanger.disableOnCollision) {
		obj.SetActiveRecursively(false);
	}
	
	var heatBarCollected : HeatBarCollected = obj.GetComponent("HeatBarCollected");
	
	if(heatBarCollected != null) {
		heatBarCollected.Trigger();
	}

}

function ShowExplosionPowerUp () {
	explosionPowerUpEmitter.emit = true;
	yield WaitForSeconds(0.5);
	explosionPowerUpEmitter.emit = false;
}

function OnFlareCountChange(notification : Notification) {
	numActiveFlares = notification.data;
}