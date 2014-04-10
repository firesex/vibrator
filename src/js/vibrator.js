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
	// global variables for the script
	var vibrations; // the different objects Vibration stored in datas.json
	var idInterval = 0; // the id of the function in the interval in order to stop the interval
	var currentVib = null; // the current object Vibration running. if none, === null
	var currentButton = null; // the current button in action (null if none)
	var anim = document.querySelector("#main"); // the animation to run
	var description = document.querySelector("#description"); // where to write the description of a button

	// wait for translation

	// get vibrations from datas.json
	vibrations = datas.ARRAY.map(function(el) { return Vibration.createVibes(el); });
	datas.ARRAY = null; //freed

	// get the user's customization from the localstorage
	var persoSaved = localStorage.getItem(vibrations[datas.CUSTOM]);
	console.log(persoSaved);
	if (persoSaved !== null)
		vibrations[datas.CUSTOM] = Vibrations.createVibes(persoSaved);
	persoSaved = null; // freed

	// insert the buttons in the webpage
	var ul = document.createElement("ul"), li, button;
	var i;
	
	for (i = 0; i < datas.LENGTH; i++)
	{
		li = document.createElement("li");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute("id", "b" + i);
		button.setAttribute("class", "unactive");
		button.appendChild(document.createTextNode(vibrations[i].name));
		button.addEventListener("click", startVibrations);
		li.appendChild(button);
		ul.appendChild(li);
	}
	document.querySelector("#buttons").appendChild(ul);

	// callbacks for UI actions

	// callbacks functions
	function startVibrations (event)
	{
		var index = parseInt(event.target.getAttribute("id").slice(1), 10);

		if (currentButton !== null || currentVib !== null)
			stopVibrations();
		currentButton = event.target;
		currentVib = vibrations[index];

		currentButton.removeEventListener("click", startVibrations);
		currentButton.addEventListener("click", stopVibrations);
		currentButton.className = "active";
		anim.classList.add("vibrate");
		description.innerHTML = currentVib.description;
		if (index === datas.CUSTOM)
			;
		if (index === datas.MMH)
			vibrateRandom(); // set idInterval in it
		else
			idInterval = setInterval(vibrate, currentVib.time);
	}

	function stopVibrations ()
	{
		navigator.vibrate(0);
		clearInterval(idInterval);
		idInterval = 0;
		if (currentButton !== null)
		{
			currentButton.removeEventListener("click", stopVibrations);
			currentButton.addEventListener("click", startVibrations);
			currentButton.className = "unactive";
		}
		anim.classList.remove("vibrate");
		description.innerHTML = "";
		currentButton = null;
		currentVib = null;
	}
	

	function vibrate ()
	{
		navigator.vibrate(currentVib.vibes);
	}

	function vibrateRandom ()
	{
		// random config
		var i;
		clearInterval(idInterval);
		for (i = 0; i < currentVib.vibes.length; i++)
		{
			if (i % 2 === 0)
				currentVib.vibes[i] = Math.round(Math.random() * 950 + 50);
			else
				currentVib.vibes[i] = Math.round(Math.random() * 500 + 50);
		}
		idInterval = setInterval(vibrateRandom, currentVib.time);
		vibrate();
	}
})();

