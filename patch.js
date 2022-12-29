/**
 * Basic dark mode patch for IPFire
 * Made by Jiab77 - 2022
 * 
 * @version 0.1.0
 */

"use strict";

// Create the query list.
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

// CSS patch as inline code
const cssPatch = `
.bigbox {
    background: #444;
    color: #fff;
    transition: all .5s;
}
#cssmenu a {
    color: #fff;
    transition: color .5s;
}
#cssmenu>ul>li.active a,
#cssmenu>ul>li:hover>a {
    background: #d90000;
}
#cssmenu .has-sub ul li a {
    background: #444;
    color: #fff;
}
#cssmenu .has-sub ul li:hover a {
    background: #777;
}
#main_inner h1 {
    color: #ff0000;
    transition: all .5s;
}
.rrdimage button {
    color: #00bfff;
    transition: color .5s;
}
.rrdimage li:not(:first-child)::before {
    color: #fff;
    transition: color .5s;
}
div.rrdimage>img {
    filter: invert(100%);
    transition: filter .5s;
}
`;

// Icons from Icon8 library
const lightModeIcon = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABCElEQVR4nO1Vy27CQAzcG/0E+IZ+QBESys6NfwzfAdxCeVzbW6Xah/xFiy3BIodGikKTBpIcqnakOWxkzazsjNe5f3SJkEYPRtcXhLAy9mfAfiPsnzsRU8arEuLit/A2HRlLdXNlvNxuQIiFcAppNKyagZlZTfkijZGLK2Mi5Pcm9sWdUjQu1twNNXH2B2WEIoXwqe/+ybWFkN+XxQsm25vErL9CWAohyQaaZudTtYE/BpoNslkw1kJ+UZuTVgaE5EeD71uEXU2LEtcWStG4YsgfwnhsJZ6Hyv4WG6i15EIkuXg5eM1vzphfBc36TbNBJ0Gz+DdaFYT4rlXR+7KrWddL92sfnL+JM0NjT++NCMA3AAAAAElFTkSuQmCC';
const darkModeIcon = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAC0ElEQVR4nK1VW4iMcRT/dt1JcsuDko2kdWmbc2Z3W7F5VEhqheLNAx7IJUXteMLSFtGc882uZF1iX/BCllqKpMjWbrvznTMTNpfcShJRfDoze5lvdprL5tQ8zHfO//c79+M4BaQ6Fq9Akl3AcgpILwFLDEiPInsbl7d1TXFGKxjV9UjyHFgESZrDpDtCUVkLrjYgyR5guY4sH4ClrYb65hcNDG58FpDeQ5ZHQIkV+WwXnpEJaTJ9g6QHCoKHY8lFyKLI3sGiPXKGnHqALBcb2v0xOY1qW3pmAImH0cTmUsAHBdxn44DlltXKySVIcgNJGp08UnVeZufT17X2TQWWbqtfQBFmbxWy9tZHOscGFL5fBq5stXog6S9k9ZH0O7I2mS4XSSjqrUTSvgAWkNyx7sgOGUnbU6AZP+ueZdHX0/NFAiS3w6SbBoCS04D0S/2FlxMzjaw1R4CT3DfifOCpt1HdhqxX039Y1llxgt4n5yHp7wAByV9wNeQUIeGzvTOR9NOgp7uA9XSQQHaOTI0miwHPyMBXcN9OdtJjr4eDSj2RTYCsHaUQ2AawNeOAq/uB9GRASXokRwRdpUWgH222HCBvC5JeCRC4ujpHgX/axBYDXtvcPwlYfqRaGVxZgKTvnIhfPmQR8cuB9EWONDUV5b2bWAOkD4c9ZunOXmwYTSy1QgUJ5I+1YEEC1lZg3Zf5YTeS3s02rCapRNYnI9qV5Fwg4sw3sXgFsH6uaUnOCU4ti4KrG3I9AldD1s7Istdugq3pnK77fhmy3ESWyMiwXK2z4QjHdIkzSkGSRmR9mr0Vhj0l3Q4s721hlYQc8cuR9DiyvKolb25eW0uBRQIsx2xPFcJOpY+lE0geB/KeT+zGAutlI0KSltS+cuOL7cgbSDjmVaVroh02UHY2K9t7xhcf8oDYCQWWQykPWfrtJgDpN7sdQHLNhtSOTMnA/1P+AZ3W+f5vFhygAAAAAElFTkSuQmCC';

// Create theme selector
const darkModeSelector = document.createElement('div');
darkModeSelector.id = 'theme-selector';
darkModeSelector.style.float = 'right';
darkModeSelector.style.marginLeft = '15px';

// Target 'cssmenu' DOM element
const cssMenu = document.getElementById('cssmenu');

// Target 'traffic' DOM element
const trafficElement = document.getElementById('traffic');

// Inject theme selector before 'traffic' DOM element
cssMenu.insertBefore(darkModeSelector, trafficElement);

// Patch inject
function injectPatch() {
    // Target document 'head'
    const docHead = document.head || document.getElementsByTagName('head')[0];

    // Try to inject new 'style' element in document head
    if (docHead.insertAdjacentElement) {
        // Insert new 'style' element
        docHead.insertAdjacentHTML("beforeend", `<style id="dark-theme-patch">${cssPatch}</style>`);
    }
    else {
        // Create new 'style' element
        const newStyle = createElement('style');
        newStyle.type = 'text/css';
        newStyle.id = 'dark-theme-patch';

        // Insert CSS code inside the new 'style' element
        if (newStyle.styleSheet) {
            // This is required for IE8 and below.
            newStyle.styleSheet.cssText = cssPatch;
        }
        else {
            newStyle.appendChild(document.createTextNode(cssPatch));
        }

        // Inject new 'style' element using old way
        docHead.appendChild(newStyle);
    }
}

// Patch removal
function removePatch() {
    // Target injected 'style' element
    const injectedPatch = document.getElementById('dark-theme-patch');

    // Remove previously injected patch
    injectedPatch.remove();
}

// Store selected theme
function storeThemeChange(state) {
    localStorage.setItem('dark-mode', state);
}

// Theme change handler
function handleThemeChange(state) {
    const themeSelector = document.getElementById('theme-selector');

    // console.log('Received value:', state);

    if (state.matches) {
        // Load dark theme
        console.log('Injecting dark theme.');
        themeSelector.innerHTML = `<img src="data:image/png;base64,${lightModeIcon}" style="cursor: pointer;" onclick="handleThemeChange(window.matchMedia('(prefers-color-scheme: dark)'));">`;
        injectPatch();
    }
    else {
        // Load light theme (means unload dark theme css file)
        console.log('Removing dark theme.');
        themeSelector.innerHTML = `<img src="data:image/png;base64,${darkModeIcon}" style="cursor: pointer;" onclick="handleThemeChange(window.matchMedia('(prefers-color-scheme: light)'));">`;
        if (document.getElementById('dark-theme-patch') !== null) {
            removePatch();
        }
    }

    // Store theme change
    storeThemeChange(JSON.stringify({matches: state.matches}));
}

// Initial theme load
handleThemeChange(JSON.parse(localStorage.getItem('dark-mode')) || darkModeQuery);

// Monitor query changes
darkModeQuery.addEventListener('change', handleThemeChange);

// Remove listener on unload
window.onunload = () => {
    darkModeQuery.removeEventListener('change');
}
