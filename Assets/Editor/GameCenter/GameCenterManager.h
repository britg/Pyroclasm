//
//  GameCenterManager.h
//  GameCenterTest
//
//  Created by Mike on 9/3/10.
//  Copyright 2010 Prime31 Studios. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GameKit/GameKit.h>
#include <GameKit/GKLeaderboardViewController.h>
#include <GameKit/GKAchievementViewController.h>
#include <GameKit/GKAchievement.h>
#include <GameKit/GKLocalPlayer.h>
#include <GameKit/GKPlayer.h>


// Comment out this line to turn off logging
#define DEBUG = 1

#ifdef DEBUG
#define ALog(format, ...) NSLog(@"%@", [NSString stringWithFormat:format, ## __VA_ARGS__]);
#else
#define ALog(format, ...)
#endif



@interface GameCenterManager : NSObject <GKAchievementViewControllerDelegate, GKLeaderboardViewControllerDelegate>
{
	NSMutableDictionary *_achievementsDictionary;
	UIViewController *_viewControllerWrapper;
	BOOL _showCompletionBanner;
}
@property (nonatomic, retain) NSMutableDictionary *achievementsDictionary;



+ (BOOL)isGameCenterAvailable;


+ (GameCenterManager*)sharedManager;


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark Shared methods with GameCenterMultiplayer

- (void)showViewControllerModallyInWrapper:(UIViewController*)viewController;

- (void)dismissWrappedController;


// public
///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark player methods

- (void)authenticateLocalPlayer;


// Player information
- (BOOL)isPlayerAuthenticated;

- (NSString*)playerAlias;

- (NSString*)playerId;

- (BOOL)isUnderage;

- (void)retrieveFriendsIncludingProfileImages:(BOOL)loadProfileImages;

- (void)loadPlayerData:(NSArray*)identifiers andProfileImages:(BOOL)loadProfileImages;

- (void)loadProfilePhotoForLocalPlayer;


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark leaderboard methods

- (void)loadLeaderboardCategoryTitles;

- (void)reportScore:(int64_t)score forLeaderboard:(NSString*)category;

- (void)showLeaderboardWithTimeScope:(GKLeaderboardTimeScope)timeScope;

- (void)showLeaderboardWithTimeScope:(GKLeaderboardTimeScope)timeScope category:(NSString*)category;


// range must be beteen 1 - 100
- (void)retrieveScores:(BOOL)friendsOnly timeScope:(GKLeaderboardTimeScope)timeScope range:(NSRange)range;

- (void)retrieveScores:(BOOL)friendsOnly timeScope:(GKLeaderboardTimeScope)timeScope range:(NSRange)range category:(NSString*)category;

- (void)retrieveScoresForPlayerId:(NSString*)playerId;

- (void)retrieveScoresForPlayerId:(NSString*)playerId category:(NSString*)category;


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark Achievement methods

- (void)reportAchievementIdentifier:(NSString*)identifier percentComplete:(float)percent;

- (void)getAchievements;

- (void)resetAchievements;

- (void)showAchievements;

- (void)retrieveAchievementMetadata;

- (void)showCompletionBannerForAchievements;


@end
