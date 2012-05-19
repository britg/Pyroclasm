#pragma strict

// Correct implementation
enum ScrollColor { GREEN = 0,
				   PURPLE = 1,
				   RED = 2 }

static var GREEN : int = 0;
static var TEMP_MULTIPLIER : int = 75;
static var PURPLE : int = 1;
static var CORONA_MULTIPLIER : float = 0.16666;
static var RED : int = 2;

static var GREEN_TEMP : int = 0;
static var PURPLE_TEMP : int = 1000;
static var RED_TEMP : int = 2000;

static var TIER1_DISTANCE : float = 0.0;
static var TIER2_DISTANCE : float = 1000.0;
static var TIER3_DISTANCE : float = 2000.0;


static var COLORS : Array = [GREEN, PURPLE, RED];
static var NUM_COLORS : int = 3;
static var NUM_LEVELS : int = 6;

static var STATUS_ENABLED : int = 1;
static var STATUS_DISABLED : int = 2;
static var STATUS_USED : int = 3;

static var MESSAGE_DEFAULT : String = "The Lost Mage Scrolls";
static var MESSAGE_NOT_FOUND : String = "This scroll hasn't been found... yet!";
static var MESSAGE_ALREADY_USED : String = "It's been burned to ashes...";

static var SCROLLS : Array = [ 	
	[["Eldarus before The Surge", "Inferno! Start with a slightly higher Temperature."], 
	 ["Geldar's Star Charts", "Inferno! Start with a slightly higher Temperature."], 
	 ["The Secrets of Mana Shards", "Inferno! Start with a modestly higher Temperature."],
	 ["A Retelling of the Events of The Surge", "Inferno! Start with a modestly higher Temperature."],
	 ["Thorn’s Regret", "Inferno! Start with a much higher Temperature."],
	 ["Dwarven Techniques of Spell-Forging", "Inferno! Start with a much higher Temperature."]
	 ], // GREEN
	 
	[["The Appearance of the Magi", "Demon Blessing! Slightly larger and longer Coronas."],
	 ["History of The Spire", "Demon Blessing! Slightly larger and longer Coronas."],
	 ["Stories of the Magi Veldt","Demon Blessing! Modestly larger and longer Coronas."],
	 ["Dragon Lineage", "Demon Blessing! Modestly larger and longer Coronas."],
	 ["Mysteries of the Sorcerer's Garden","Demon Blessing! Huge and long lasting Coronas."],
	 ["Power Words of the Magi", "Demon Blessing! Huge and long lasting Coronas."]
	 ], // PURPLE
	 
	[["Hand-drawn map of Ettin Gorge", "Gem Lust! Start with a few extra gems."], 
	 ["Known Symptoms of Mana Burn",  "Gem Lust! Start with a few extra gems."],
	 ["Pyroclastic Scriptures", "Gem Lust! Start with some extra gems."],
	 ["Thaumaturgist’s Travels", "Gem Lust! Start with some extra gems."],
	 ["Thodrynn’s Encounter with Eruk", "Gem Lust! Start with many extra gems."],
	 ["List of Lost Books of the First Era", "Gem Lust! Start with many extra gems."]
	 ] 	// RED
];

private static var playerScrolls : Scrolls;
static function PlayerScrolls () {
    if (!playerScrolls) {
        var scrollsObject: GameObject = new GameObject("Player Scrolls Object");
        playerScrolls = scrollsObject.AddComponent(Scrolls);
    }
   
    return playerScrolls;
}

function ScrollStatus(color : int, level : int) {
	return STATUS_ENABLED;
	var status : int = PlayerPrefs.GetInt(keyForScroll(color, level));
	//status = Mathf.Floor(Random.value * 3); 
	if(status < 1) {
		status = STATUS_DISABLED;
	} else {
		switch(status) {
			case 2:
				status = STATUS_DISABLED;
			break;
			case 3:
				status = STATUS_USED;
			break;
			case 1:
				status = STATUS_ENABLED;
			break;
		}
	}
	
	return status;
}

function scrollNameAt(color : int, level : int) {
	var scrollsInColor : Array = SCROLLS[color];
	var scroll : Array = scrollsInColor[level];
	return scroll[0];
}

function scrollAbilityAt(color : int, level : int) {
	var scrollsInColor : Array = SCROLLS[color];
	var scroll : Array = scrollsInColor[level];
	return scroll[1];
}

function getPosition(color: int, level : int) {
	var yPos : float = 1.0 - (color * 0.3) - 0.29;
	var xPos : float = 1.0/8.0 * (level + 1) + 0.08;
	var position : Vector3 = Vector3(xPos, yPos, -1);
	return position;
}

function keyForScroll(color : int, level : int) {
	return "v2_scroll_" + color.ToString() + "_" + level.ToString();
}

var scrollForNextRun : Hashtable;
var scrollsThisRun : Array = new Array();

function ActivateScroll(scroll : Hashtable) {
	scrollForNextRun = scroll;
	var key : String = keyForScroll(scroll["color"], scroll["level"]);
	PlayerPrefs.SetInt(key, STATUS_USED);
}

function DefineScroll(color : int, level : int) {
	var name : String = scrollNameAt(color, level);
	var data : Hashtable = new Hashtable();
	data.Add("name", name);
	data.Add("color", color);
	data.Add("level", level);
	data.Add("ability", Scrolls.PlayerScrolls().scrollAbilityAt(color, level));
	
	return data;
}

function AcquireScroll(distance : float, heat : int) {

	var color : int = ColorFromHeat(heat);
	var level : int = TierFromDistance(distance);
	
	var key : String = keyForScroll(color, level);
	PlayerPrefs.SetInt(key, STATUS_ENABLED);
	
	var scroll : Hashtable = DefineScroll(color, level);
	scrollsThisRun.Push(scroll);
	return scroll;
}

function ColorFromHeat(heat : int) {

	if(heat < PURPLE_TEMP) {
		return GREEN;
	} else if (heat < RED_TEMP) {
		return PURPLE;
	}
	
	return RED;
}

function TierFromDistance(distance : float) {

	var subtier : int = Mathf.Floor(Random.value * 1.99);

	if(distance < TIER2_DISTANCE) {
		return subtier;
	} else if (distance < TIER3_DISTANCE) {
		return subtier + 2;
	}
	
	return subtier * 4;
}