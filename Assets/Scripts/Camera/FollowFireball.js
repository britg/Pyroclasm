#pragma strict

private var Fireball : GameObject;

function Start () {
	Fireball = GameObject.Find("Fireball");
}

function Update () {
	transform.position.x = Fireball.transform.position.x;
}