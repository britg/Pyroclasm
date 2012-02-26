
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
	var isCollector = obj.GetComponent("Collector");
	
	if(isFireball || (isCollector && isCollector.wallActive)) {
		emitter.emit = true;
	}
}