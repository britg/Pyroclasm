#pragma strict

// Correct implementation
enum ScrollColor { GREEN = 0,
				   PURPLE = 1,
				   RED = 2 }

static var GREEN : int = 0;
static var PURPLE : int = 1;
static var RED : int = 2;

static var COLORS : Array = [GREEN, PURPLE, RED];

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
	 
	[["The Second Era and the Appearance of the Magi", "Demon Blessing! Start with a small Corona"],
	 ["History of The Spire", "Demon Blessing! Start with a small Corona"],
	 ["Stories of the Magi Veldt","Demon Blessing! Start with a moderate Corona"],
	 ["Dragon Lineage", "Demon Blessing! Start with a moderate Corona."],
	 ["Mysterys of the Sorcerer's Garden","Demon Blessing! Start with a huge Corona."],
	 ["Power Words of the Magi", "Demon Blessing! Start with a huge Corona."]
	 ], // PURPLE
	 
	[["Hand-drawn map of Ettin Gorge", "Gem Lust! Start with a few extra gems."], 
	 ["Known Symptoms of Mana Burn",  "Gem Lust! Start with a few extra gems."],
	 ["Pyroclastic Scriptures", "Gem Lust! Start with some extra gems."],
	 ["Thaumaturgist’s Travels", "Gem Lust! Start with some extra gems."],
	 ["Thodrynn’s Encounter with the Demon Eruk", "Gem Lust! Start with many extra gems."],
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
	var status : int = PlayerPrefs.GetInt(keyForScroll(color, level));
	status = Mathf.Floor(Random.value * 3); 
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
	var yPos : float = 1.0 - (color * 0.3) - 0.27;
	var xPos : float = 1.0/8.0 * (level + 1) + 0.08;
	var position : Vector3 = Vector3(xPos, yPos, -1);
	return position;
}

function keyForScroll(color : int, level : int) {
	return "scroll_" + color.ToString() + "_" + level.ToString();
}

var scrollForNextRun : Hashtable;
