/*
Mmh Vibrator! transforms your phone into a sensual sextoy!
Copyright © 2014 firesex
mmhfiresex@gmail.com

This file is part of Mmh Vibrator!

Mmh Vibrator! is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

/**
 * Represent a vibration: an object containing an array of value to be passed at the navigator.vibrate() function.
 * Actually, the application contains 4 vibration objects: slow, long, continuous, custom and Mmh!
 * @param copy: it's to act as a copy constructor. this value is optional.
 */
function Vibration (copy)
{
	var cpName = "", cpDescr = "", cpVibes = [];

	if (typeof copy !== "undefined")
	{
		cpName = copy.name || "";
		cpDescr = copy.description || "";
		cpVibes = copy.vibes || [];
	}

	Object.defineProperties(this, {
		/** the name of the object */
		"name": {
			value: cpName,
			enumerable: true,
			writable: true
		},

		/** the description of the object */
		"description": {
			value: cpDescr,
			enumerable: true,
			writable: true
		},

		/** the values to be entered in navigator.vibrate() function */
		"vibes": {
			value: cpVibes,
			enumerable: true,
			writable: true
		},

		/** @return the total time of vibrations stored in vibes (o(n)) */
		"time": { get: function () {
					var i, time = 0;
					for (i = 0; i < this.vibes.length; i++)
						time += this.vibes[i];
					return time;
				}
		}
	});
}

/**
 * Transform an array of object get with a JSON.parse into an array of Vibration objects (with the "time" member)
 * @param the array from the JSON.parse
 * @return an array of Vibration objects
 */
Object.defineProperty(Vibration, "createVibes", { value: function (values) {
	var i, retour = [];

	for (i = 0; i < values.length; i++)
		retour.push(new Vibration(values[i]));
	return retour;
}});


