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

(function ()
{
	"use strict";
	// wait for translation

	// get vibrations from datas.json
	var vibrations = Vibration.createVibes(datas.ARRAY);

	// get the user's customization from the localstorage

	// insert the buttons in the webpage
	var ul = document.createElement("ul"), li, button;
	var i;
	
	for (i = 0; i < datas.LENGTH; i++)
	{
		li = document.createElement("li");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute("id", vibrations[i].name);
		button.setAttribute("class", "unactive");
		button.appendChild(document.createTextNode(vibrations[i].name));
		li.appendChild(button);
		ul.appendChild(li);
	}
	document.querySelector("#buttons").appendChild(ul);

	// callbacks for UI actions

	// callbacks functions
})();

