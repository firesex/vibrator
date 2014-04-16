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
 * represent a DOM element where the user will write the wanted vibration, for the custom thing
 * @param insertButton must be true if the button to delete the entry must be added
 */
function DOMVibration (insertButton)
{
	Object.defineProperties(this, {
		/** Contains the input where to read the value entered by the user */
		"input": {
		enumerable: true,
		writable: true
		},

		/** Contains the li element to add in the dom */
		"li": {
			enumerable: true,
			writable: true
		},

		/** the button to delete the entry, null if insertButton === false */
		"button": {
			value: null,
			enumerable: true,
			writable: true
		}
	});

	this.input = document.createElement("input");
	this.input.setAttribute("type", "number");
	this.input.setAttribute("required", "required");
	this.input.setAttribute("min", "50");
	this.input.setAttribute("max", "1000");
	this.input.setAttribute("placeholder", "50 to 1000");
	this.li = document.createElement("li");
	this.li.appendChild(this.input);
	if (insertButton)
	{
		this.button = document.createElement("button");
		this.button.setAttribute("type", "button");
		this.button.innerHTML = "Remove";
		this.li.appendChild(this.button);
	}
}

/**
 * represent the list of entries for the custom thing.
 * contains a list of DOMVibration
 * @param vibration the current custom vibration (to initialize the inputs)
 */
function ListVibes (vibration)
{
	var ul = document.querySelector("#vibes"); // the list where to add the li elements
	var initValue = vibration; // the initial values
	var vibrations = []; // the list of DOMVibration

	Object.defineProperties(this, {
		/** The vibration created by the user */
		"customVibe": {
			get: function () { return createVibration(); }.bind(this)
		},

		/** return the vvibration entered by the user */
		"onSave": {
			value: function () { return createVibration(); }.bind(this)
		},

		/** clear the gui */
		"onCancel": {
			value: function () { initialize(); }.bind(this)
		},

		/** add a li element in the list of vibes */
		"addVibes": {
			value: function ()
			{
				var index = vibrations.length;

				if (index < 10)
				{
					vibrations[index] = new DOMVibration(index >= 2);
					if (index >= 2)
					{
						vibrations[index].button.setAttribute("id", "customBtn" + index);
						vibrations[index].button.addEventListener("click", this.removeVibes);
					}
					ul.appendChild(vibrations[index].li);
				}
				if (vibrations.length < 10)
					document.querySelector("#addVibes").classList.remove("hidden");
				else
					document.querySelector("#addVibes").classList.add("hidden");
			}.bind(this)
		},

		/** @param event the button event */
		"removeVibes": {
			value: function (event)
			{
				removeVibes(parseInt(event.target.getAttribute("id").slice(9), 10));
			}.bind(this)
		}
	});

	/** remove the li at the given index */
	var removeVibes = function (index)
	{
		var i;

		ul.removeChild(vibrations[index].li);
		vibrations.splice(index, 1);
		for (i = index; i < vibrations.length; i++)
			vibrations[i].button.setAttribute("id", "customBtn" + i);
		if (vibrations.length < 10)
			document.querySelector("#addVibes").classList.remove("hidden");
	};

	/** @return the new customized vibration */
	var createVibration = function ()
	{
		var i, j = 0, input;
		var customized = new Vibration(initValue)

		while (customized.vibes.length > 0)
			customized.vibes.pop(); // clear the array
		for (i = 0; i < vibrations.length; i++)
		{
			input = vibrations[i].input;
			if (input.validity.valid)
			{
				customized.vibes[j] = input.valueAsNumber;
				j++;
			}
			else
				removeVibes(i--);
		}
		return customized;
	};

	/** initialize the GUI with enough li to display initValue */
	var initialize = function ()
	{
		var i;
		var parentNode = ul.parentNode;

		parentNode.removeChild(ul);
		while (ul.hasChildNodes()) // remove all the li elements
		{
			ul.removeChild(ul.firstChild);
		}
		vibrations.length = 0;
		for (i = 0; i < initValue.vibes.length; i++)
		{
			this.addVibes();
			vibrations[i].input.value = initValue.vibes[i];
		}
		parentNode.appendChild(ul);
	};

	// constructor
	removeVibes = removeVibes.bind(this);
	createVibration = createVibration.bind(this);
	initialize = initialize.bind(this);
	initialize();
}


