
private var thisFireball : GameObject;
private var fireballTemperature : Temperature;

var pickupSound : AudioClip;
var cooldownSound : AudioClip;
var explosionSound : AudioClip;

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
		
		if(tempChanger.playPickupSound) {
			thisFireball.audio.PlayOneShot(pickupSound);
		}
		
		if(tempChanger.playCooldownSound) {
			Camera.main.audio.PlayOneShot(cooldownSound);
		}
		
		if(tempChanger.playExplosionSound) {
			Camera.main.audio.PlayOneShot(explosionSound);
		}
		
		if(tempChanger.removeOnCollision) {
			Destroy(obj);
		}
		
		if(tempChanger.disableOnCollision) {
			obj.SetActiveRecursively(false);
		}
		
		if(tempChanger.shakesCamera) {
			Camera.main.animation.Play();
		}
	}

}

function OnFlareCountChange(notification : Notification) {
	numActiveFlares = notification.data;
}