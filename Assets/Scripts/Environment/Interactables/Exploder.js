
private var emitter : ParticleEmitter;

function Awake () {
	emitter = transform.Find("Explosion").GetComponent.<ParticleEmitter>(); 
}

function OnEnable () {
	emitter.emit = false;
}

function OnTriggerEnter () {
	emitter.emit = true;
}