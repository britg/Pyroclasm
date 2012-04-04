
private var emitter : ParticleEmitter;

function Start () {
	emitter = transform.gameObject.Find("IceBoltShards").GetComponent.<ParticleEmitter>(); 
}

function OnEnable () {
	if(emitter) {
		emitter.emit = false;
	}
}

function OnTriggerEnter (collider : Collider) {

	var obj = collider.gameObject;
	var isFireball = obj.GetComponent("Temperature");
	
	if(isFireball) {
		emitter.emit = true;
	}
	
}