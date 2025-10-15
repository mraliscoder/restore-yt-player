// ==UserScript==
// @name         Old YouTube Player
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  Disable new modern UI player (YouTube)
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function() {
    'use strict';
    
    // Intercept classList.add to prevent delhi classes
    const originalAdd = DOMTokenList.prototype.add;
    DOMTokenList.prototype.add = function(...tokens) {
        const filtered = tokens.filter(token => !token.includes('delhi'));
        if (filtered.length > 0) {
            originalAdd.apply(this, filtered);
        }
    };
    
    const css = document.createElement('style');
    css.innerText = `
.ytp-right-controls-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
.ytp-right-controls {
    display: flex;
}
.ytp-right-controls-right {
    display: flex;
    align-items: center;
}
.ytp-left-controls .ytp-button:not(.ytp-next-button):not(.ytp-prev-button):not(.ytp-live-badge):not(.ytp-chapter-title):not([style*="display: none"]):not([style*="display:none"]),
.ytp-right-controls .ytp-button:not(.ytp-expand-right-bottom-section-button):not(.ytp-autonav-toggle):not([style*="display: none"]):not([style*="display:none"]),
.ytp-right-controls .ytp-subtitles-button-icon:not([style*="display: none"]):not([style*="display:none"]) {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
}
.ytp-right-controls .ytp-settings-button {
    overflow: hidden;
}
.ytp-play-button svg {
    width: 24px;
    height: 24px;
}
.ytp-expand-right-bottom-section-button {
    display: none !important;
}
.ytp-time-contents {
    display: flex;
    gap: 3px;
}
.ytp-chrome-bottom {
    height: 54px !important;
}
    `;
    document.head.appendChild(css);
    
    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true };
    
    const callback = () => {
        const playerDiv = document.querySelector('.ytd-player#container .html5-video-player');
        if (playerDiv) {
            window.playerDiv = playerDiv;
            Array.from(playerDiv.classList).forEach(className => {
                if (className.includes('delhi')) {
                    playerDiv.classList.remove(className);
                }
            });
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            callback();
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        });
    } else {
        callback();
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
})();
