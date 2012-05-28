
static var PREFIX : String 					= "pyrodev.";

static var LEADERBOARD : String 			= PREFIX + "run";

static var DISTANCE_TIER1 : String 			= PREFIX + "1000m";
static var DISTANCE_TIER2 : String 			= PREFIX + "2000m";
static var DISTANCE_TIER3 : String 			= PREFIX + "3000m";
static var DISTANCE_UNTOUCHED : String		= PREFIX + "1000m.untouched";
static var DISTANCE_POWERUPS : String		= PREFIX + "1000m.nopowerup";

static var STREAK_TIER1 : String 			= PREFIX + "500streak";
static var STREAK_TIER2 : String 			= PREFIX + "1000streak";
static var STREAK_TIER3 : String 			= PREFIX + "1500streak";

static var COLLISION_BOOKSHELVES : String	= PREFIX + "20bookcases";
static var COLLISION_TAPESTRIES : String	= PREFIX + "15tapestries";
static var COLLISION_FOUNTAINS : String		= PREFIX + "10fountains";
static var COLLISION_ICICLES : String		= PREFIX + "5icicles";

static var SCROLLS_SINGLE : String			= PREFIX + "scroll";
static var SCROLLS_ALL : String				= PREFIX + "allscrolls";

static function Report(cheev : String) { Report(cheev, 100.0); }

static function Report(cheev : String, completion : float) {
	var already : int = PlayerPrefs.GetInt(cheev);
	if(already == 1) return;
	
	PlayerPrefs.SetInt(cheev, 1);
    GameCenterBinding.reportAchievement(cheev, completion);
}