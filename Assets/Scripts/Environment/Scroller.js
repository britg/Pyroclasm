
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0;
var startAcceleration : float = 0.07;
var maxVelocity : float = 25.0;

var started : boolean = false;

var titleScreen : GUITexture;
var highScore : GUIText;

function Start() {
	Time.timeScale = 1.0;
	
	var distance = PlayerPrefs.GetInt("distance");
	var highTemp = PlayerPrefs.GetInt("temp");
	highScore.enabled = true;
	highScore.text = "Best Distance: " + Mathf.Round(distance) + "m\nHighest Temp: " + highTemp + "°";
}

function Begin() {
	started = true;
	velocity = startVelocity;
	acceleration = startAcceleration;
	titleScreen.enabled = false;
	highScore.enabled = false;
}

function Update() {

	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
	
	if(!started && inputsForStart())
		Begin();

}

function inputsForStart() {
	return ( Input.touchCount > 0 || Input.GetMouseButton(0) || Input.GetKey("space") );
}