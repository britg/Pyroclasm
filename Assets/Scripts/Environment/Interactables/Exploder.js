
private var emitter : ParticleEmitter;

function Awake () {
	emitter = transform.Find("Explosion").GetComponent.<ParticleEmitter>(); 
}

function OnEnable () {
	emitter.emit = false;
}

function OnTriggerEnter (collider : Collider) {

	var obj = collider.gameObject;
	var isFireball = obj.GetComponent("Temperature");
	var isSatellite = obj.GetComponent("Satellite");
	
	if(isFireball || isSatellite) {
		emitter.emit = true;
	}
}