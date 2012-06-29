//
//  GameCenterBinding.m
//  GameCenterTest
//
//  Created by Mike on 9/3/10.
//  Copyright 2010 Prime31 Studios. All rights reserved.
//

#import "GameCenterManager.h"
#include <GameKit/GameKit.h>


// Converts NSString to C style string by way of copy (Mono will free it)
#define MakeStringCopy( _x_ ) ( _x_ != NULL && [_x_ isKindOfClass:[NSString class]] ) ? strdup( [_x_ UTF8String] ) : NULL

// Converts C style string to NSString
#define GetStringParam( _x_ ) ( _x_ != NULL ) ? [NSString stringWithUTF8String:_x_] : [NSString stringWithUTF8String:""]



bool _gameCenterIsGameCenterAvailable()
{
	return [GameCenterManager isGameCenterAvailable];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark Player methods

void _gameCenterAuthenticateLocalPlayer()
{
	[[GameCenterManager sharedManager] authenticateLocalPlayer];
}


bool _gameCenterIsPlayerAuthenticated()
{
	return [[GameCenterManager sharedManager] isPlayerAuthenticated];
}


const char * _gameCenterPlayerAlias()
{
	NSString *alias = [[GameCenterManager sharedManager] playerAlias];
	return MakeStringCopy( alias );
}


const char * _gameCenterPlayerIdentifier()
{
	NSString *playerId = [[GameCenterManager sharedManager] playerId];
	return MakeStringCopy( playerId );
}


bool _gameCenterIsUnderage()
{
	return [[GameCenterManager sharedManager] isUnderage];
}


void _gameCenterRetrieveFriends( bool loadProfileImages )
{
	[[GameCenterManager sharedManager] retrieveFriendsIncludingProfileImages:loadProfileImages];
}


void _gameCenterLoadPlayerData( const char * playerIds, bool loadProfileImages )
{
	// grab the product list and split it on commas
	NSString *identifiers = [NSString stringWithUTF8String:playerIds];
	NSArray *playerIdArray = [identifiers componentsSeparatedByString:@","];

	[[GameCenterManager sharedManager] loadPlayerData:playerIdArray andProfileImages:loadProfileImages];
}


void _gameCenterLoadProfilePhotoForLocalPlayer()
{
	[[GameCenterManager sharedManager] loadProfilePhotoForLocalPlayer];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark Leaderboard methods

void _gameCenterLoadLeaderboardLeaderboardTitles()
{
	[[GameCenterManager sharedManager] loadLeaderboardCategoryTitles];
}


void _gameCenterReportScore( int64_t score, const char *leaderboardId )
{
	[[GameCenterManager sharedManager] reportScore:score forLeaderboard:GetStringParam( leaderboardId )];
}


void _gameCenterShowLeaderboardWithTimeScope( int timeScope )
{
	[[GameCenterManager sharedManager] showLeaderboardWithTimeScope:timeScope];
}


void _gameCenterShowLeaderboardWithTimeScopeAndLeaderboardId( int timeScope, const char * leaderboardId )
{
	[[GameCenterManager sharedManager] showLeaderboardWithTimeScope:timeScope category:GetStringParam( leaderboardId )];
}


void _gameCenterRetrieveScores( bool friendsOnly, int timeScope, int start, int end )
{
	[[GameCenterManager sharedManager] retrieveScores:friendsOnly timeScope:timeScope range:NSMakeRange( start, end )];
}


void _gameCenterRetrieveScoresForLeaderboard( bool friendsOnly, int timeScope, int start, int end, const char * leaderboardId )
{
	[[GameCenterManager sharedManager] retrieveScores:friendsOnly timeScope:timeScope range:NSMakeRange( start, end ) category:GetStringParam( leaderboardId )];
}


void _gameCenterRetrieveScoresForPlayerId( const char *playerId )
{
	[[GameCenterManager sharedManager] retrieveScoresForPlayerId:GetStringParam( playerId )];
}


void _gameCenterRetrieveScoresForPlayerIdAndLeaderboard( const char *playerId, const char * leaderboardId )
{
	[[GameCenterManager sharedManager] retrieveScoresForPlayerId:GetStringParam( playerId ) category:GetStringParam( leaderboardId )];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark Achievements methods

void _gameCenterReportAchievement( const char * identifier, float percent )
{
	[[GameCenterManager sharedManager] reportAchievementIdentifier:GetStringParam( identifier ) percentComplete:percent];
}


void _gameCenterGetAchievements()
{
	[[GameCenterManager sharedManager] getAchievements];
}


void _gameCenterResetAchievements()
{
	[[GameCenterManager sharedManager] resetAchievements];
}


void _gameCenterShowAchievements()
{
	[[GameCenterManager sharedManager] showAchievements];
}


void _gameCenterRetrieveAchievementMetadata()
{
	[[GameCenterManager sharedManager] retrieveAchievementMetadata];
}


void _gameCenterShowCompletionBannerForAchievements()
{
	[[GameCenterManager sharedManager] showCompletionBannerForAchievements];
}

