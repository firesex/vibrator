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
 * Actually, the application contains 5 vibration objects: slow, medium, long, custom and Mmh!
 * @param copy: it's to act as a copy constructor. this value is optional.
 */
function Vibration (copy)
{
	var cpName = "", cpDescr = "", cpVibes = [];
	var idInterval = -1;

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
		"time": {
			get: function () {
				var i, time = 0;
				for (i = 0; i < this.vibes.length; i++)
					time += this.vibes[i];
				return time;
			}
		},

		/** @return true if the object is currently vibrating */
		"isVibrating": {
			get: function() { return idInterval !== -1; }
		},

		/** make the object vibrate with the values in the vibes array */
		"startVibration": {
			value: function () {
				idInterval = setInterval(vibrate, this.time);
				vibrate();
			}
		},

		/** make the object vibrate with values picked up in the vibes array randomly */
		"startVibrationRandom": {
			value: function () {
				idInterval = setInterval(vibrateRandom, this.time);
				vibrateRandom();
			}
		},

		/** stop the vibrations */
		"stopVibration": {
			value: function () {
				navigator.vibrate(0);
				clearInterval(idInterval);
				idInterval = -1;
			}
		}
	});

	/** 
	 * callback function used to make the phone virate, called by the interval
	 * @param values: make vibrate with these values. if not given, use the array this.vibes
	 */
	var vibrate = function (values)
	{
		if (typeof values === "undefined")
			values = this.vibes;
		navigator.vibrate(values);
	};
	vibrate = vibrate.bind(this);

	/** each time this function is called, create 5 vibrations taken in the vibes array and call vibrate() */
	var vibrateRandom = function ()
	{
		var i, values = [], time = 0;
		clearInterval(idInterval);
		for (i = 0; i < 5; i++)
		{
			values[i] = this.vibes[Math.round(Math.random() * this.vibes.length)];
			time += values[i];
		}
		idInterval = setInterval(vibrateRandom, time);
		vibrate(values);
	};
	vibrateRandom = vibrateRandom.bind(this);
}

/**
 * Transform an object get with a JSON.parse into a Vibration object (with the "time" member)
 * @param the array from the JSON.parse
 * @return a Vibration object
 */
Object.defineProperty(Vibration, "createVibes", { value: function (object) {
	return new Vibration(object);
}});


