
var tempDiff : int;
var playPickupSound : boolean = false;
var playCooldownSound : boolean = false;
var playExplosionSound : boolean = false;
var removeOnCollision : boolean = false;
var disableOnCollision : boolean = false;
var shakesCamera : boolean = false;

var used : boolean = true;

function OnEnable() {
	used = false;
}
