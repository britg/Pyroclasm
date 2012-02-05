
var cameraShake : boolean = false;

function OnCollisionEnter(theCollision : Collision){
	
	Destroy(gameObject);
	
	if(cameraShake) {
		Camera.main.animation.Play();
	}
	
}