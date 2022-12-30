/**
 * Basic dark mode patch for IPFire
 * Made by Jiab77 - 2022
 * 
 * @version 0.2.1
 */

"use strict";

// Create the query list.
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

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

// Detect current URL/Path
function getCurrentPath() {
    const currentURL = document.URL ? document.URL : window.location.href;
    // console.log('Current URL:', currentURL);
    const parsedURL = new URL(currentURL);
    // console.table(parsedURL);
    console.log('Current Path:', parsedURL.pathname);
    return parsedURL.pathname;
}

// Inject given patch
function injectPatch(id, patch) {
    // Target document 'head'
    const docHead = document.head || document.getElementsByTagName('head')[0];

    // Try to inject new 'style' element in document head
    if (docHead.insertAdjacentElement) {
        // Insert new 'style' element
        docHead.insertAdjacentHTML("beforeend", `<style id="${id}">${patch}</style>`);
    }
    else {
        // Create new 'style' element
        const newStyle = createElement('style');
        newStyle.type = 'text/css';
        newStyle.id = id;

        // Insert CSS code inside the new 'style' element
        if (newStyle.styleSheet) {
            // This is required for IE8 and below.
            newStyle.styleSheet.cssText = patch;
        }
        else {
            newStyle.appendChild(document.createTextNode(patch));
        }

        // Inject new 'style' element using old way
        docHead.appendChild(newStyle);
    }
}

// Remove given patch
function removePatch(id) {
    // Target injected 'style' element
    const injectedPatch = document.getElementById(id);

    // Remove previously injected patch
    if (injectedPatch !== null) {
        injectedPatch.remove();
    }
}

// Inject patch that can be applied to style almost everything
function injectGenericPatch() {
    // Inline CSS code for generic changes
    const cssPatchGeneric = `
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
    color: palevioletred;
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
font[color="#339933"], font[color="green"] {
    color: #23c723;
    transition: color .5s;
}
font[color="#333399"], font[color="blue"] {
    color: #00bfff;
    transition: color .5s;
}
font[color="#808080"] {
    color: #b1b1b1;
    transition: color .5s;
}
font[color="red"] {
    color: orangered;
    transition: color .5s;
}
a {
    color: orangered;
    transition: color .5s;
}
`;

    // Call main injection method
    injectPatch('dark-theme-generic-patch', cssPatchGeneric);
}

// Generic patch removal method
function removeGenericPatch() {
    // Call main removal method
    removePatch('dark-theme-generic-patch');
}

// Inject conditional patch based on the current URL pathname
function injectConditionalPatch() {
    const currentPath = getCurrentPath();
    let cssPatchConditional;

    switch (currentPath) {
        case '/cgi-bin/fireinfo.cgi':
        case '/cgi-bin/connscheduler.cgi':
        case '/cgi-bin/logs.cgi/firewalllogip.dat':
        case '/cgi-bin/logs.cgi/firewalllogport.dat':
        case '/cgi-bin/logs.cgi/firewalllogcountry.dat':
        case '/cgi-bin/logs.cgi/ipblocklists.dat':
        case '/cgi-bin/logs.cgi/ovpnclients.dat':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
`;
            break;

        case '/cgi-bin/vulnerabilities.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:first-of-type {
    color: #000;
}
`;
            break;

        case '/cgi-bin/remote.cgi':
        case '/cgi-bin/hosts.cgi':
        case '/cgi-bin/routing.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post:last-of-type > table {
    color: #000;
}
.bigbox > #main_inner > .post:last-of-type > table a {
    color: #d90000;
}
`;
            break;

        case '/cgi-bin/aliases.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox table:first-of-type td.base {
    color: #ff9ebe !important;
    transition: color .5s;
}
.bigbox table:first-of-type td.base:nth-of-type(5) {
    color: #fff !important;
    transition: color .5s;
}
.bigbox table:last-of-type {
    color: #000;
}
.bigbox table:last-of-type a {
    color: #d90000;
}
`;
            break;

        case '/cgi-bin/services.cgi':
        case '/cgi-bin/dhcp.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
.bigbox table.tbl a {
    color: #d90000;
}
`;
            break;

        case '/cgi-bin/dns.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
.bigbox table.tbl tr:first-child td strong {
    color: #fff;
    transition: color .5s;
}
`;
            break;

        case '/cgi-bin/updatexlrator.cgi':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);

            /**
             * There is a bug in the rendered table for the cache statistics
             * section of this page.
             * 
             * The table cells should have a background color but the quotes are misplaced
             * which then leads to a rendering bug that simply does not assign the defined color.
             * 
             * Actual code: '<tr bgcolor="" #d6d6d6'="">'
             * Correct code: '<tr bgcolor="#d6d6d6">'
             * 
             * This then make the patching a little bit more tricky as this bug does not exist
             * in the cache maintenance section.
             * 
             * So I must create two distinct rules to apply the same style.
             */

            cssPatchConditional = `
/* Rules for the cache statistics table (the one with the broken 'bgcolor' value) */
.bigbox table {
    color: #fff;
    transition: color .5s;
}
/* Rules for the cache management table */
.bigbox table:nth-of-type(4) tr:first-child td.base {
    color: #fff;
    transition: color .5s;
}
.bigbox table:nth-of-type(4) tr[bgcolor="#E0E0E0"] td.base,
.bigbox table:nth-of-type(4) tr[bgcolor="#F0F0F0"] td.base {
    color: #000;
}
.bigbox table:nth-of-type(4) td.base a {
    color: #d90000;
}
`;
            break;

        case '/cgi-bin/logs.cgi/proxylog.dat':
        case '/cgi-bin/logs.cgi/firewalllog.dat':
        case '/cgi-bin/logs.cgi/ids.dat':
            console.log(`Applying conditional patch for:\n - ${currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:nth-of-type(1) tr:first-child td a,
.bigbox > #main_inner > .post > table:nth-of-type(3) tr:first-child td a {
    color: #00bfff;
    font-weight: 700;
    transition: color .5s;
}
.bigbox > #main_inner > .post > table:nth-of-type(2) {
    color: #000;
}
`;
            break;

        default:
            console.log('No conditional patch defined for this page.');
            cssPatchConditional = '';
            break;
    }

    // Call main injection method
    injectPatch('dark-theme-conditional-patch', cssPatchConditional);
}

// Conditional patch removal method
function removeConditionalPatch() {
    // Call main removal method
    removePatch('dark-theme-conditional-patch');
}

// Inject all required patches
function injectPatches() {
    injectGenericPatch();
    injectConditionalPatch();
}

// Remove all applied patches
function removePatches() {
    removeGenericPatch();
    removeConditionalPatch();
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
        injectPatches();
    }
    else {
        // Load light theme (means unload dark theme css file)
        console.log('Removing dark theme.');
        themeSelector.innerHTML = `<img src="data:image/png;base64,${darkModeIcon}" style="cursor: pointer;" onclick="handleThemeChange(window.matchMedia('(prefers-color-scheme: light)'));">`;
        removePatches();
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
