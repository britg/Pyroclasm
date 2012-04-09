var initiator : GUITexture;
var loader : GUITexture;
var started : boolean = false;
private var paused : boolean = false;


private var loaded : boolean = false;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
}

function Update() {

	if (!loaded) {
		CheckLoaded();
		return;
	}
	
	if(started) {
		return;
	}

	for (var touch : Touch in Input.touches) {
        if (touch.phase == TouchPhase.Began) {
        	if(initiator.enabled && initiator.HitTest(touch.position)) {
        		GameCenterBinding.showLeaderboardWithTimeScope(GameCenterLeaderboardTimeScope.AllTime);
        		//GameCenterBinding.showAchievements();
        		return;
        	}
        }
    }
	
}	


function CheckLoaded() {
	loaded = GameCenterBinding.isPlayerAuthenticated();
	
	if (loaded) {
		loader.enabled = false;
	}
}

function OnGameStart() {
	initiator.enabled = false;
	loader.enabled = false;
	started = true;
}