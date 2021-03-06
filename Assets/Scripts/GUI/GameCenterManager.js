var loaderButton : GUITexture;
var achievementButton : GUITexture;
var leaderBoardButton : GUITexture;

var gameCenterEnabled : boolean = true;

private var loaded : boolean = false;
private var scrollGUIActive : boolean = false;
private var gameStarted : boolean = false;

// -9.25
private var shouldAnimate : boolean = false;
private var buttonStart : float = -9.35;
private var buttonSpread : float = 0.15;
private var achievementTargetX : float = buttonStart + buttonSpread;
private var leaderBoardTargetX : float = buttonStart - buttonSpread;
private var achievementAnimateVelocity : float;
private var leaderBoardAnimateVelocity : float;
private var animateTime : float = 0.3;

function Start () {
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_ACHIEVEMENTS);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LEADERBOARD);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_GUI_ACTIVATED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_GUI_DEACTIVATED);
	
	leaderBoardButton.enabled = false;
	achievementButton.enabled = false;
	
	if(gameCenterEnabled && GameCenterBinding.isGameCenterAvailable()) {
		GameCenterBinding.authenticateLocalPlayer();
		GameCenterBinding.showCompletionBannerForAchievements();
	} else {
		DisableGUI();
	}
	
}

function Update() {

	if (!loaded) {
		CheckLoaded();
	}
	
	if (shouldAnimate) {
		AnimateButtons();
	}
	
}

function OnTouchAchievements () {
	if(!loaded)
		return;
	GameCenterBinding.showAchievements();
}

function OnTouchLeaderboard () {
	if(!loaded)
		return;
	GameCenterBinding.showLeaderboardWithTimeScope(GameCenterLeaderboardTimeScope.AllTime);
}

function CheckLoaded() {
	var check : boolean = GameCenterBinding.isPlayerAuthenticated();
	
	if (check && !scrollGUIActive) {
		loaded = true;
		
		if(!gameStarted) {
			leaderBoardButton.enabled = true;
			achievementButton.enabled = true;
			loaderButton.enabled = false;
			shouldAnimate = true;
		}
	}
}

function AnimateButtons() {

	var achievementCurrentX : float = achievementButton.transform.localPosition.x;
	//Debug.Log("Achievement current x is " + achievementCurrentX);
	//return;
	achievementButton.transform.localPosition.x = Mathf.SmoothDamp(achievementCurrentX, achievementTargetX, achievementAnimateVelocity, animateTime);
	
	var leaderBoardCurrentX : float = leaderBoardButton.transform.localPosition.x;
	leaderBoardButton.transform.localPosition.x = Mathf.SmoothDamp(leaderBoardCurrentX, leaderBoardTargetX, leaderBoardAnimateVelocity, animateTime);
}

function OnGameStart() {
	DisableGUI();
	gameStarted = true;
}

function DisableGUI() {
	shouldAnimate = false;
	achievementButton.enabled = false;
	leaderBoardButton.enabled = false;
	loaderButton.enabled = false;
}

function OnScrollGUIActivated() {
	scrollGUIActive = true;
	achievementButton.enabled = false;
	leaderBoardButton.enabled = false;
	loaderButton.enabled = false;
}

function OnScrollGUIDeactivated() {
	scrollGUIActive = false;
	if(gameCenterEnabled && GameCenterBinding.isGameCenterAvailable()) {
		achievementButton.enabled = true;
		leaderBoardButton.enabled = true;
	}
}