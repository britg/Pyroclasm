
private var fireball : GameObject;
private var temp : Temperature;

function Awake() {
	fireball = GameObject.Find("Fireball");
	temp = fireball.GetComponent("Temperature");
}

function OnParticleCollision (other : GameObject)
{
	var isFireball : Temperature = other.GetComponent("Temperature");
	var isCollector : Collector = other.GetComponent("Collector");
	
	if(isFireball || isCollector) {
		temp.TempChange(5, true);
	}
}