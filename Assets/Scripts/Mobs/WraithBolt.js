#pragma strict

private var fireball : GameObject;
private var toY : float;

function Start () {
}

function OnEnable() {
	fireball = GameObject.Find("Fireball");
	toY = fireball.transform.position.y;
}

function Update () {
	//Aim();
}

function Aim() {
	transform.position.y = Mathf.Lerp(transform.position.y, toY, 0.01);
}