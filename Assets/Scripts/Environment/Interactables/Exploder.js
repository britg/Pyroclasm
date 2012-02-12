
function OnTriggerEnter () {
	var emitter : ParticleEmitter = transform.Find("Explosion").GetComponent.<ParticleEmitter>(); 
	emitter.emit = true;
}