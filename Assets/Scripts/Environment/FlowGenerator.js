
private var distance : int = 0;

private var patterns : Object[];
private var xStart = 10;
private var lastX : float = 10.0;
private var lastMark : float;
private var patternPadding : float = 10.0;

var bonusChance : float 			= 40.0;
private var bonuses : Array 		= ["torch", "bookcase", "gargoyle", "tapestry"];
private var bonusTiers : Array 		= [60.0, 	80.0, 		85.0, 		100.0];
private var obstacles : Array 		= ["iceshards", "portrait", "gargoyle"];

var eventChance : float = 5.0;
private var eventActive : boolean = false;

private var alignment = 1;

function Awake () {
	LoadPatterns();
}

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.HEAT_PATTERN_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_ENDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.DISTANCE_UPDATE);
}

function LoadPatterns() {
	patterns = Resources.LoadAll("Patterns", GameObject);
}

function OnGameStart() {
	RequestBonusBlock();
}

function RequestBonusBlock() {
	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	
	if(scroll && scroll["color"] == Scrolls.RED) {
		var level : int = scroll["level"];
		var lust : GameObject = Instantiate(Resources.Load("BonusBlock"), Vector3(0, 3.0, -1), Quaternion.identity);	
		var blockBehaviour : BonusBlock = lust.GetComponent("BonusBlock");
		blockBehaviour.cols += level;
		blockBehaviour.DrawGems();
	}
}

function Update () {
	UpdateFlow();
}


function UpdateFlow() {

	var distDelta : float = distance - lastMark;
	if(distDelta <= (lastX + patternPadding))
		return;
	
	if(eventActive)
		return;
	
	//RequestEvent();
	RequestPattern();
	//RequestObject();
	
	lastMark = distance;
}

function RequestEvent() {
	var roll : float = Random.value * 100;
	if(roll <= eventChance) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_REQUESTED);
	}
}

function RequestPattern () {
	var pattern : GameObject = patterns[Random.Range(0, patterns.length)];
	Instantiate(pattern);
}

function RequestObject () {

	var x : float = lastX + xStart + patternPadding/2 - 2;
	var hit : RaycastHit;
	
	if(Physics.Raycast(Vector3(x, 1, -10), Vector3(0, 0, 1), hit, 20.0)) {
		//Debug.Log("Hit occurred on " + hit.collider.gameObject);
		return;
	}
	
	var bonusRoll : float = Mathf.Floor(Random.value * 100.0);
	if(bonusRoll <= bonusChance) {
		if(alignment == 1) {
			RequestBonus(x);
		} else {
			RequestObstacle(x);
		}
	} else {
		if(alignment == 1) {
			RequestObstacle(x);
		} else {
			RequestBonus(x);
		}
	}
	
}

function RequestBonus (x : float) {
	//Debug.Log("Bonus Requested!");
	var roll : float = Mathf.Floor(Random.value * 100.0);
	var which : int;
	var tier : float;
	
	for ( which = 0; which < bonusTiers.length; which++ ) {
		tier = bonusTiers[which];
		if(roll <= tier) {
			break;
		}
	}
	
	var obj : String = bonuses[which];
	var note : String;
	switch (obj) {
		case "torch":
			note = Notifications.GENERATE_TORCH;
		break;
		case "bookcase":
			note = Notifications.GENERATE_BOOKCASE;
		break;
		case "gargoyle":
			note = Notifications.GENERATE_GARGOYLE_BONUS;
		break;
		case "tapestry":
			note = Notifications.GENERATE_TAPESTRY;
		break;
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, note, x);
}

function RequestObstacle (x : float) {
	//Debug.Log("Obstacle Requested!");
	
	var obstacle : String = obstacles[Mathf.Floor(Random.value * obstacles.length)];
	var note: String;
	
	switch(obstacle) {
		
		case "gargoyle":
			note = Notifications.GENERATE_GARGOYLE_OBSTACLE;
		break;
		case "portrait":
			note = Notifications.GENERATE_PORTRAIT;
		break;
		case "iceshards":
			note = Notifications.GENERATE_ICESHARDS;
		break;
	
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, note, x);

}

function OnHeatPatternEnd (notification : Notification) {
	lastX = notification.data;
	lastMark = distance;
}

function OnEventStarted() {
	eventActive = true;
}

function OnEventEnded() {
	eventActive = false;
}


function OnPolerize() {
	alignment = -1;
}

function OnUnpolerize() {
	alignment = 1;
}

function OnDistanceUpdate(n : Notification) {
	distance = n.data;
}