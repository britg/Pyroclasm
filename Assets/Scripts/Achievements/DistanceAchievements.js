#pragma strict

private var distance : int;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.FIRST_POWERUP);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.FIRST_POWERDOWN);
	
}

function OnGameEnd (n : Notification) {

	var score : Hashtable = n.data;
	distance = score["distance"];
	
	UpdateLocal();

	if(!GameCenterBinding.isGameCenterAvailable()) return;
		
	UpdateLeaderboard();
	UpdateAchievements();
}

function UpdateLocal() {
	var prevDistance : int = PlayerPrefs.GetInt("distance");
	
	if(distance > prevDistance) {
		PlayerPrefs.SetInt("distance", distance);
	}
}

function UpdateLeaderboard() {
	
	var prevDistance : int = PlayerPrefs.GetInt("distance");
		
	if(distance > prevDistance) {
		GameCenterBinding.reportScore(distance, Achievement.LEADERBOARD);
	}
}

function UpdateAchievements() {
	
	if(distance >= 3000) {
		Achievement.Report(Achievement.DISTANCE_TIER3);
	}
	
	if(distance >= 2000) {
		Achievement.Report(Achievement.DISTANCE_TIER2);
	}
	
	if(distance >= 1000) {
		Achievement.Report(Achievement.DISTANCE_TIER1);
	}

}

function OnFirstPowerup(n : Notification) {
	var distance : int = n.data;
	
	if(distance >= 1000) {
		Achievement.Report(Achievement.DISTANCE_POWERUPS);
	}
}

function OnFirstPowerdown(n : Notification) {
	var distance : int = n.data;
	
	if(distance >= 1000) {
		Achievement.Report(Achievement.DISTANCE_UNTOUCHED);
	}
}