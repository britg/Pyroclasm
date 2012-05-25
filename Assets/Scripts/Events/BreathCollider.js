
private var fireball : GameObject;
private var temp : Temperature;

function Awake() {
	fireball = GameObject.Find("Fireball");
	temp = fireball.GetComponent("Temperature");
}

function OnParticleCollision (other : GameObject)
{
		//Debug.Log("HIT");
		temp.TempChange(1, true);
}