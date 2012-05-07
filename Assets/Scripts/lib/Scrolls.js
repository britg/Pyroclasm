#pragma strict

static var GREEN : int = 0;
static var PURPLE : int = 1;
static var RED : int = 2;

static var COLORS : Array = [GREEN, PURPLE, RED];

static var STATUS_ENABLED : int = 1;
static var STATUS_DISABLED : int = 2;
static var STATUS_USED : int = 3;

static var SCROLLS : Array = [ 	
	["Eldarus before The Surge", 
	 "Geldar's Star Charts", 
	 "The Secrets of Mana Shards",
	 "A Retelling of the Events of The Surge",
	 "Thorn’s Regret",
	 "Dwarven Techniques of Spell-Forging"
	 ], // GREEN
	 
	["The Second Era and the Appearance of the Magi", 
	 "History of The Spire", 
	 "Stories of the Magi Veldt",
	 "Dragon Lineage",
	 "Mysterys of the Sorcerer's Garden",
	 "Power Words of the Magi  (Caution: Do Not Read Aloud)"
	 ], // PURPLE
	 
	["Hand-drawn map of Ettin Gorge", 
	 "Known Symptoms of Mana Burn", 
	 "Pyroclastic Scriptures",
	 "Thaumaturgist’s Travels",
	 "Thodrynn’s Encounter with the Demon Eruk",
	 "List of Lost Books of the First Era"
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
	if(status < 1) {
		status = STATUS_DISABLED;
	}
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
	
	return status;
}

function keyForScroll(color : int, level : int) {
	return "scroll_" + color.ToString() + "_" + level.ToString();
}

