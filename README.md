Process Monitor for Chrome
==========================

Monitor Google Chrome's CPU and memory usage, drill down to identify misbehaving processes and take action.

Use Google Chrome? Ever suffer from any of the following:

- Chrome slowing to a crawl?
- Tabs freezing up?
- Your computer's fan whirring like crazy/laptop heating up?

Particular sites like Gmail and Facebook, and plugins like Gmail Offline are particularly susceptible to maxing out Chrome's CPU and memory.
This extension for Chrome makes it easy to identify when particular tabs or processes are misbehaving, and reload or close them to restore peace.

## You get:

_An icon in your address bar with current CPU usage and animated graph so you can easily detect when something within Chrome is causing an issue:_

![CPU icon](http://f.cl.ly/items/3T390m3v3Y2H293o0U3W/Process%20Monitor%20CPU%20Icon.png)

_A detailed popup with list of all processes sorted by CPU or memory usage, historic CPU graphs, and actions to reload or shut down misbehaving processes:_

![Popup](http://f.cl.ly/items/383L0i1M2Y2T2r173S1h/Process%20Monitor%20Popup.png)


Installation Instructions
=========================

The extension utilises some [experimental Chrome APIs](http://developer.chrome.com/extensions/experimental.processes.html) for accessing and managing processes. Unfortunately this means it can't (yet) be distributed through the Chrome Web Store - you need to install it manually. Luckily, this is not difficult - and only takes a minute:

1. Enable the experimental APIs
    1. Start Google Chrome
    2. Open up <a href="chrome://flags" target="_blank">chrome://flags</a> (copy and paste into a new tab)
    3. Search for "Experimental Extension APIs" and enable
    4. Relaunch Chrome for this to take effect (use the Relaunch button that appears at the bottom of the screen and all your open tabs will be preserved)

2. Install the extension
    1. [Download the source (.zip)](http://cl.ly/PMOY) and unzip.
    2. Open <a href="chrome://extensions" target="_blank">chrome://extensions</a> (copy and paste into a new tab) or select Tools > Extensions from the Chrome menu
    3. Ensure the "Developer mode" box at the top of the page is ticked, and click the "Load unpacked extension.." button (see screenshot below)
    4. Browse to select the folder containing the files you've just downloaded and unzipped
    5. And you're done! The extension will appear in your address bar. Keep an eye on it to monitor your CPU usage, and click for further details at any time.

![Step 3 - installing an extension manually](http://f.cl.ly/items/2Q2G3y3k232s3z1S1p0c/Screen%20Shot%202013-06-03%20at%2003.33.45.png)

Credits
=======

Created by me, [@andyy](http://twitter.com/andyy)

Licence: MIT

Code at [https://github.com/andyyoung/Process-Monitor-for-Chrome](https://github.com/andyyoung/Process-Monitor-for-Chrome)
