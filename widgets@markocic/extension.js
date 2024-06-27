/* This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 */
/* exported init */
'use strict';
import * as backgroundClock from './extensions/backgroundClock.js';
import * as batteryBar from './extensions/batteryBar.js';
import * as dashBoard from './extensions/dashBoard.js';
import * as dateMenuTweaks from './extensions/dateMenuTweaks.js';
import * as dynamicPanel from './extensions/dynamicPanel.js';
import * as mediaPlayer from './extensions/mediaPlayer.js';
import * as notificationIndicator from './extensions/notificationIndicator.js';
import * as powerMenu from './extensions/powerMenu.js';
import * as quickSettingsTweaks from './extensions/quickSettingsTweaks.js';
import * as stylishOSD from './extensions/stylishOSD.js';
import * as windowHeaderbar from './extensions/windowHeaderbar.js';
import * as workspaceIndicator from './extensions/workspaceIndicator.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const ExtensionImports = [
    backgroundClock,
    batteryBar,
    dashBoard,
    dateMenuTweaks,
    mediaPlayer,
    notificationIndicator,
    powerMenu,
    workspaceIndicator,
    dynamicPanel,
    windowHeaderbar,
    // quickSettingsTweaks,
    stylishOSD
];
const Extensions = {
    backgroundClock: 'background-clock',
    batteryBar: 'battery-bar',
    dashBoard: 'dash-board',
    dateMenuTweaks: 'date-menu-tweaks',
    mediaPlayer: 'media-player',
    notificationIndicator: 'notification-indicator',
    powerMenu: 'power-menu',
    workspaceIndicator: 'workspace-indicator',
    dynamicPanel: 'dynamic-panel',
    windowHeaderbar: 'window-headerbar',
    // quickSettingsTweaks: 'quick-settings-tweaks',
    stylishOSD: 'stylish-osd',
};

export default class MyExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._instances = {};
    }

    enable() {
        const settings = this.getSettings();

        for (const [index, extensionName] of Object.keys(Extensions).entries()) {
            const settings_key = Extensions[extensionName];

            this._instances[extensionName] = new ExtensionImports[index].MyExtension(settings);

            if (settings.get_boolean(settings_key)) {
                this._toggleExtension(this._instances[extensionName]);
            }

            settings.connect(`changed::${settings_key}`, () => {
                this._toggleExtension(this._instances[extensionName]);
            });
        }
    }

    disable() {
        for (const instance of Object.values(this._instances)) {
            if (instance.enabled) {
                instance.disable();
                instance.enabled = false;
            }
        }
        this._instances = {};
    }

    _toggleExtension(instance) {
        if (!instance.enabled) {
            instance.enable();
            instance.enabled = true;
        } else {
            instance.disable();
            instance.enabled = false;
        }
    }
}

function init(meta) {
    return new MyExtension(meta);
}

