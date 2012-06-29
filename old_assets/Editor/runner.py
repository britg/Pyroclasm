#!/usr/bin/python

from UpdateXcode import *
import os, uuid, sys, types, re
import StringIO
import plistlib
import hashlib
import logging
import syslog



class PluginHelper:
	@classmethod
	def getAllPluginFoldersThatNeedProcessing( cls, sourceFolder ):
		# fetch all the plugin folders. this will include those that might be processed by other postprocess scripts
		pluginFolders = PluginHelper.getAllPluginFolders( sourceFolder )
		
		# fetch all the folders that will be handled by post process scripts
		handledFolders = PluginHelper.getAllFoldersHandledByPostProcessScripts( sourceFolder )
		
		# filter out any folders that are handled by post process scripts
		return filter( lambda f: not f in handledFolders, pluginFolders )


	@classmethod
	def getAllPluginFolders( cls, sourceFolder ):
		pluginFolders = []

		# fetch a dir list to start
		for folder in os.listdir( sourceFolder ):
			fullPath = os.path.join( sourceFolder, folder )
			if str.startswith( folder, "." ) or str.endswith( folder, ".meta" ) or not os.path.isdir( fullPath ):
				continue
			# skip AdWhirl scripts of all kinds
			if "AdWhirl" in folder:
				continue
			if PluginHelper.doesFolderContainsConfig( fullPath ):
				pluginFolders.append( folder )
		return pluginFolders


	@classmethod
	def getAllFoldersHandledByPostProcessScripts( cls, sourceFolder ):
		pluginFolders = []

		# fetch a dir list to start
		for f in os.listdir( sourceFolder ):
			fullPath = os.path.join( sourceFolder, f )
			if str.startswith( f, "." ) or str.endswith( f, ".meta" ) or os.path.isdir( fullPath ):
				continue
			if "PostprocessBuildPlayer_" in f:
				temp = str.replace( f, "PostprocessBuildPlayer_", "" )
				temp = str.replace( temp, "DISABLED", "" )
				syslog.syslog( syslog.LOG_ALERT, 'file has postprocess in it: %s' % temp )
				pluginFolders.append( temp )
		return pluginFolders


	@classmethod
	def doesFolderContainsConfig( cls, folder ):
		for f in os.listdir( folder ):
			if f == 'config.plist':
				return True
		return False


	@classmethod
	def processPlugin( cls, projectPath, unityProjectPath, plugin ):
		syslog.syslog( syslog.LOG_ALERT, '--- About to kick off the Runner for ' + plugin + ' ---' )

		try:
			run = Runner( projectPath, unityProjectPath, plugin )
		except Exception, e:
			syslog.syslog( syslog.LOG_ALERT, 'runner failed with error: %s' % e )

		syslog.syslog( syslog.LOG_ALERT, '--- Finished ' + plugin + ' ---' )



if __name__ == "__main__":
	syslog.openlog( 'Prime31' )
	shouldProcessFolders = len( sys.argv ) == 2

	if not shouldProcessFolders:
		# grab our arguments and only process this single plugin
		projectPath = sys.argv[1]
		unityProjectPath = sys.argv[2]
		pluginName = sys.argv[3]

		PluginHelper.processPlugin( projectPath, unityProjectPath, pluginName )
		exit

	syslog.syslog( syslog.LOG_ALERT, 'Processing all folders' )

	# we need to iterate all the directories to get our folders
	projectPath = sys.argv[1]
	unityProjectPath = os.getcwd().replace( '/Assets/Editor', '' )

	# fetch all the plugin folders
	pluginFolders = PluginHelper.getAllPluginFoldersThatNeedProcessing( os.path.join( unityProjectPath, "Assets/Editor" ) )

	# process each one
	for plugin in pluginFolders:
		PluginHelper.processPlugin( projectPath, unityProjectPath, plugin )


