/**
 * Basic dark mode patch for IPFire
 * Made by Jiab77 - 2022
 * 
 * @version 0.3.0
 */

"use strict";

// Config
const useEncodedPaths = true;

// Create the query list.
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Icons from Feather library
const lightModeIcon = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmRjNDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXN1biI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSI+PC9jaXJjbGU+PGxpbmUgeDE9IjEyIiB5MT0iMSIgeDI9IjEyIiB5Mj0iMyI+PC9saW5lPjxsaW5lIHgxPSIxMiIgeTE9IjIxIiB4Mj0iMTIiIHkyPSIyMyI+PC9saW5lPjxsaW5lIHgxPSI0LjIyIiB5MT0iNC4yMiIgeDI9IjUuNjQiIHkyPSI1LjY0Ij48L2xpbmU+PGxpbmUgeDE9IjE4LjM2IiB5MT0iMTguMzYiIHgyPSIxOS43OCIgeTI9IjE5Ljc4Ij48L2xpbmU+PGxpbmUgeDE9IjEiIHkxPSIxMiIgeDI9IjMiIHkyPSIxMiI+PC9saW5lPjxsaW5lIHgxPSIyMSIgeTE9IjEyIiB4Mj0iMjMiIHkyPSIxMiI+PC9saW5lPjxsaW5lIHgxPSI0LjIyIiB5MT0iMTkuNzgiIHgyPSI1LjY0IiB5Mj0iMTguMzYiPjwvbGluZT48bGluZSB4MT0iMTguMzYiIHkxPSI1LjY0IiB4Mj0iMTkuNzgiIHkyPSI0LjIyIj48L2xpbmU+PC9zdmc+';
const darkModeIcon = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzODljZGMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLW1vb24iPjxwYXRoIGQ9Ik0yMSAxMi43OUE5IDkgMCAxIDEgMTEuMjEgMyA3IDcgMCAwIDAgMjEgMTIuNzl6Ij48L3BhdGg+PC9zdmc+';

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
.bigbox .heading,
.bigbox select.pflist {
    color: #000;
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
font[color="#993333"], font[color="red"] {
    color: orangered;
    transition: color .5s;
}
font[color="#808080"] {
    color: #b1b1b1;
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
    const encodedCurrentPath = btoa(currentPath);
    console.log(`Encoded path: ${encodedCurrentPath}`)
    let cssPatchConditional;

    switch (useEncodedPaths === true ? encodedCurrentPath : currentPath) {
        case 'L2NnaS1iaW4vZmlyZWluZm8uY2dp':
        case 'L2NnaS1iaW4vY29ubnNjaGVkdWxlci5jZ2k=':
        case 'L2NnaS1iaW4vdnBubWFpbi5jZ2k=':
        case 'L2NnaS1iaW4vb3Zwbm1haW4uY2dp':
        case 'L2NnaS1iaW4vbG9jYXRpb24tYmxvY2suY2dp':
        case 'L2NnaS1iaW4vd2lyZWxlc3MuY2dp':
        case 'L2NnaS1iaW4vZndob3N0cy5jZ2k=':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvb3ZwbmNsaWVudHMuZGF0':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
`;
            break;

        case 'L2NnaS1iaW4vdnVsbmVyYWJpbGl0aWVzLmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:first-of-type {
    color: #000;
}
`;
            break;

        case 'L2NnaS1iaW4vcmVtb3RlLmNnaQ==':
        case 'L2NnaS1iaW4vaG9zdHMuY2dp':
        case 'L2NnaS1iaW4vcm91dGluZy5jZ2k=':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvaXBibG9ja2xpc3RzLmRhdA==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post:last-of-type > table {
    color: #000;
}
.bigbox > #main_inner > .post:last-of-type > table a {
    color: #d90000;
}
`;
            break;

        case 'L2NnaS1iaW4vYWxpYXNlcy5jZ2k=':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
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

        case 'L2NnaS1iaW4vc2VydmljZXMuY2dp':
        case 'L2NnaS1iaW4vZGhjcC5jZ2k=':
        case 'L2NnaS1iaW4vaXBibG9ja2xpc3QuY2dp':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvZmlyZXdhbGxsb2dpcC5kYXQ=':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvZmlyZXdhbGxsb2dwb3J0LmRhdA==':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvZmlyZXdhbGxsb2djb3VudHJ5LmRhdA==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
.bigbox table.tbl a {
    color: #d90000;
}
`;
            break;

        case 'L2NnaS1iaW4vZG5zLmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
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

        case 'L2NnaS1iaW4vdXBkYXRleGxyYXRvci5jZ2k=':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);

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
             * 
             * Bug report created: https://bugzilla.ipfire.org/show_bug.cgi?id=13024
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

        case 'L2NnaS1iaW4vZ3VhcmRpYW4uY2dp':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl, .bigbox table tr td b {
    color: #000;
}
.bigbox table.tbl tr td:first-child,
.bigbox table tr td.boldbase b {
    color: #fff;
    transition: color .5s;
}
`;
            break;

        case 'L2NnaS1iaW4vZmlyZXdhbGwuY2dp':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl {
    color: #000;
}
.bigbox table.tbl table tr td {
    color: #fff;
    transition: color .5s;
}
`;
            break;

        case 'L2NnaS1iaW4vb3B0aW9uc2Z3LmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post:last-of-type table tr:first-child td {
    color: orangered !important;
    transition: color .5s;
}
`;
            break;

        case 'L2NnaS1iaW4vaWRzLmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl,
.bigbox > #main_inner > .post:nth-of-type(3) table,
.bigbox > #main_inner > .post:last-of-type table tr td:not(.boldbase) b {
    color: #000;
}
.bigbox table.tbl tr td:first-child,
.bigbox table tr td.boldbase b {
    color: #fff;
    transition: color .5s;
}
`;
            break;

        case 'L2NnaS1iaW4vd2lvLmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:nth-of-type(1),
.bigbox > #main_inner > .post > table:nth-of-type(2),
.bigbox > #main_inner > .post > table:nth-of-type(4),
.bigbox > #main_inner > .post > table:nth-of-type(5),
.bigbox > #main_inner > .post > form > table:nth-of-type(1) tr:first-child td b,
.bigbox > #main_inner > .post > form > table:nth-of-type(4),
.bigbox > #main_inner > .post > form > table:nth-of-type(5),
.bigbox > #main_inner > .post > form > table:nth-of-type(6),
.bigbox > #main_inner > .post > form > table:nth-of-type(7),
.bigbox > #main_inner > .post > form > table:nth-of-type(8),
.bigbox > #main_inner > .post > form > table:nth-of-type(9) {
    color: #000;
}
.bigbox table td a {
    color: #d90000;
}
.bigbox table td font[color="#993333"] {
    color: #993333;
}
.bigbox table td font[color="#333399"] {
    color: #333399;
}
.bigbox table td font[color="#339933"] {
    color: #339933;
}
`;
            break;

        case 'L2NnaS1iaW4vd2xhbmFwLmNnaQ==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox table.tbl:nth-of-type(1) tr:last-of-type,
.bigbox table.tbl:nth-of-type(3) {
    color: #000;
}
`;
            break;

        case 'L2NnaS1iaW4vbG9ncy5jZ2kvbG9nLmRhdA==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:nth-of-type(1):not(.tbl),
.bigbox > #main_inner > .post > table:last-of-type {
    color: #fff;
    transition: color .5s;
}
.bigbox > #main_inner > .post > table:nth-of-type(1) tr:first-child td a,
.bigbox > #main_inner > .post > table:nth-of-type(3) tr:first-child td a {
    color: #00bfff;
    font-weight: 700;
    transition: color .5s;
}
.bigbox table.tbl {
    color: #000;
}
`;
            break;

        case 'L2NnaS1iaW4vbG9ncy5jZ2kvcHJveHlsb2cuZGF0':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvZmlyZXdhbGxsb2cuZGF0':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvaWRzLmRhdA==':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvdXJsZmlsdGVyLmRhdA==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
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
.bigbox > #main_inner > .post > table:nth-of-type(2) a {
    color: #d90000;
}
`;
            break;

        case 'L2NnaS1iaW4vbG9ncy5jZ2kvc2hvd3JlcXVlc3Rmcm9taXAuZGF0':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvc2hvd3JlcXVlc3Rmcm9tcG9ydC5kYXQ=':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvc2hvd3JlcXVlc3Rmcm9tY291bnRyeS5kYXQ=':
        case 'L2NnaS1iaW4vbG9ncy5jZ2kvc2hvd3JlcXVlc3Rmcm9tYmxvY2tsaXN0LmRhdA==':
            console.log(`Applying conditional patch for:\n - ${useEncodedPaths === true ? encodedCurrentPath : currentPath}`);
            cssPatchConditional = `
.bigbox > #main_inner > .post > table:nth-of-type(1) tr:first-child td a,
.bigbox > #main_inner > .post > table:nth-of-type(3) tr:first-child td a {
    color: #00bfff;
    font-weight: 700;
    transition: color .5s;
}
.bigbox > #main_inner > .post > table:nth-of-type(2) tr:not(:first-child) td {
    color: #000;
}
.bigbox > #main_inner > .post > table:nth-of-type(2) a {
    color: #d90000;
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
        themeSelector.innerHTML = `<img src="data:image/svg+xml;base64,${lightModeIcon}" style="cursor: pointer; width: 18px; height: 18px; margin-top: 3px;" title="Toggle light mode" onclick="handleThemeChange(window.matchMedia('(prefers-color-scheme: dark)'));">`;
        injectPatches();
    }
    else {
        // Load light theme (means unload dark theme css file)
        console.log('Removing dark theme.');
        themeSelector.innerHTML = `<img src="data:image/svg+xml;base64,${darkModeIcon}" style="cursor: pointer; width: 18px; height: 18px; margin-top: 3px;" title="Toggle dark mode" onclick="handleThemeChange(window.matchMedia('(prefers-color-scheme: light)'));">`;
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
