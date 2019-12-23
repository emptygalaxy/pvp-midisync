const midi = require('midi');
const csv = require('csvtojson');
const fs = require('fs');
const pvpControl = require('../pvp-control/');
const playlist = require('../pvp-playlist/');
const RVPVPDocument = playlist.RVPVPDocument;
const RVPVPPlaylist = playlist.RVPVPPlaylist;


/**
 * @type {MidiNoteMapping[]}
 */
let _mapping;

/**
 *
 * @type {Object
 */
let _pvpIndexes = {};

/**
 *
 * @param {RVPVPDocument} rootDoc
 */
function makeIndexes(rootDoc)
{
    _pvpIndexes = {};
    
    /**
     * @type {RVPVPPlaylist}
     */
    let activePlaylist = rootDoc.getLastPlaylist();

    for(let prop in activePlaylist.cues)
    {
        /**
         * @type {number}
         */
        let index = parseInt(prop);

        let cue  = rootDoc.playlists[rootDoc.playlists.length - 1].cues[index];
        _pvpIndexes[cue.name] = index;
    }
}


/**
 *
 * @param {string} path
 * @param {boolean|null} reloadOnChange
 */
function loadPlaylist(path, reloadOnChange)
{
    if(reloadOnChange == null)
        reloadOnChange = true;
    playlist.load(path, reloadOnChange);
}

/**
 * Handle the message coming in
 * @param {number} deltaTime
 * @param {number[]} message
 */
function handleMidiInputMessage(deltaTime, message)
{
    console.log('m:' + message + ' d:' + deltaTime);

    let channel = (message[0] - 127) % 16;
    let note = message[1];
    let velocity = message[2];

    handleNoteChange(channel, note, velocity);
}

/**
 *
 * @param {number} channel
 * @param {number} note
 * @param {number} velocity
 */
function handleNoteChange(channel, note, velocity)
{
    console.log('handleNoteChange', channel, note, velocity);

    for(let i in _mapping)
    {
        let item = _mapping[i];

        if(item.Active === true && item.Channel === channel && item.Note === note && item.Velocity === velocity)
        {
            //  control PVP
            let pvpIndex = _pvpIndexes[item.Name];
            console.log('trigger', item.Name, pvpIndex);
            if(pvpIndex != null)
                pvpControl.triggerCue(pvpIndex + 1);
        }
    }
}

/**
 *
 * @param {MidiNoteMapping[]} mapping
 */
function loadMapping(mapping)
{
    _mapping = mapping;
}

/**
 *
 * @param {string} path
 * @param {boolean|null} reloadOnChange
 */
function loadMappingFile(path, reloadOnChange)
{
    if(reloadOnChange == null)
        reloadOnChange = true;

    // path = untildify(path);

    console.log('first load started');
    reloadMappingFile(path);
    console.log('first load finished');

    if(reloadOnChange) {
        fs.watchFile(path, (curr, prev) => {
            reloadMappingFile(path);
        });
    }
}

class MidiNoteMapping
{
    constructor(data)
    {
        /**
         * Name of the Macro/Item in ProVideoPlayer
         * @type {string}
         */
        this.Name = null;

        /**
         * Midi Channel
         * @type {number}
         */
        this.Channel = 0;

        /**
         * Midi Note number
         * @type {number}
         */
        this.Note = 0;

        /**
         * Midi Velocity
         * @type {number}
         */
        this.Velocity = 0;

        /**
         * Mapping active or not
         * @type {boolean}
         */
        this.Active = true;

        this.build(data);
    }

    build(data)
    {
        if(data.Name != null)
            this.Name = data.Name;
        if(data.Channel != null)
            this.Channel = parseInt(data.Channel);
        if(data.Note != null)
            this.Note = parseInt(data.Note);
        if(data.Velocity != null)
            this.Velocity = parseInt(data.Velocity);
        if(data.Active != null)
            this.Active = (data.Active !== "false");
    }
}

/**
 *
 * @param {string} path
 */
function reloadMappingFile(path)
{
    csv()
        .fromFile(path)
        .then((jsonObj)=>{

            /**
             * @type {MidiNoteMapping[]}
             */
            let mappings = [];
            for(let index in jsonObj)
            {
                let row = jsonObj[index];
                mappings.push(new MidiNoteMapping(row));
            }

            loadMapping(mappings);
        })
    // const jsonArray=await csv().fromFile(path);
    // loadMapping(jsonArray);
}



//  Make indexes on [cue name] <=> [index]
playlist.on('load', makeIndexes);


//  Midi input
let input = new midi.input();
input.openVirtualPort('pvp-sync');

input.on('message', handleMidiInputMessage);

pvpControl.open();

// exporting functions
exports.loadMapping = loadMapping;
exports.loadPlaylist = loadPlaylist;
exports.loadMappingFile = loadMappingFile;