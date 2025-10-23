// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// This is the crucial part:
// We are telling Metro to add 'csv' to the list of file extensions it recognizes as assets.
config.resolver.assetExts.push('csv');

module.exports = config;
