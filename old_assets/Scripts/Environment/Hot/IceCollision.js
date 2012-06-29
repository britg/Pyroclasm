
private var emitter : ParticleEmitter;

function Start () {
	emitter = transform.gameObject.GetComponent.<ParticleEmitter>(); 
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ICE_COLLISION);
}

function Update() {
}

function OnIceCollision () {
	emitter.emit = true;
	yield WaitForSeconds(0.1);
	emitter.emit = false;
}