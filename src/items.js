import loop from './svg/loop.svg';
import handklapp from './svg/handklapp.svg';
import knaboj from './svg/knaboj.svg';
import left_curlybrace from './svg/left_curlybrace.svg';
import peka_uppat from './svg/peka_uppat.svg';
import right_curlybrace from './svg/right_curlybrace.svg';
import rulla_armarna from './svg/rulla_armarna.svg';
import skakarumpa from './svg/skakarumpa.svg';
import snurra_runt from './svg/snurra_runt.svg';
import fotstamp from './svg/fotstamp.svg';

export const ITEMS = [
    {
        id: 'options',
        content: 'Options',
        fu: "options"
    },
    {
        id: 'loop',
        content: 'Loop',
        img: loop
    },
    {
        id: ':',
        content: 'Number of Repeats',
        type: 'valueContainer'
    },
    {
        id: '{',
        img: left_curlybrace,
        size: '10em'
    },
    {
        id: '}',
        img: right_curlybrace,
        size: '10em'
    },
    {
        id: 'shakeit',
        content: 'Booty',
        img: skakarumpa
    },
    {
        id: 'clap',
        content: `Clap'n Hands`,
        img: handklapp
    },
    {
        id: 'kneel',
        content: 'Get Low',
        img: knaboj
    },
    {
        id: 'pointup',
        content: 'To the Sky ',
        img: peka_uppat
    },
    {
        id: 'armroll',
        content: 'Wiggly Arm',
        img: rulla_armarna
    },
    {
        id: 'spin',
        content: 'Spin me Right Round',
        img: snurra_runt
    },
    {
        id: 'footstamp',
        content: 'Foot Stomp',
        img: fotstamp
    }
];
