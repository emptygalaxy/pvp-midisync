const midiSync = require('./');

/*
let mapping = [
    {
        'Name': 'O Light',
        'Channel': 1,
        'Note': 69,
        'Velocity': 107,
        'Active': true
    },
    {
        'Name': 'Noel',
        'Channel': 1,
        'Note': 67,
        'Velocity': 96,
        'Active': true
    },
    {
        'Name': 'O holy night',
        'Channel': 1,
        'Note': 65,
        'Velocity': 98,
        'Active': true
    },
    {
        'Name': 'Mary\'s song',
        'Channel': 1,
        'Note': 64,
        'Velocity': 98,
        'Active': true
    },
    {
        'Name': 'Sleigh Ride',
        'Channel': 1,
        'Note': 62,
        'Velocity': 99,
        'Active': true
    },
    {
        'Name': 'Joseph\'s song',
        'Channel': 1,
        'Note': 60,
        'Velocity': 102,
        'Active': true
    },
    {
        'Name': 'O come all ye faithful',
        'Channel': 1,
        'Note': 59,
        'Velocity': 102,
        'Active': true
    },
    {
        'Name': 'Light of the world',
        'Channel': 1,
        'Note': 57,
        'Velocity': 96,
        'Active': true
    },
    {
        'Name': 'Doxology',
        'Channel': 1,
        'Note': 55,
        'Velocity': 95,
        'Active': true
    },
    {
        'Name': 'Halleluja Chorus',
        'Channel': 1,
        'Note': 53,
        'Velocity': 98,
        'Active': true
    }
];
midiSync.loadMapping(mapping);
*/

midiSync.loadMappingFile('./mapping.csv');
midiSync.loadPlaylist('~/Documents/ProVideoPlayer2/20190210 RAI/playlists.xml');