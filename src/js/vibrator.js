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
	var i;

	// wait for translation

	// get vibrations from datas.json
	vibrations = datas.ARRAY.map(function(el) { return Vibration.createVibes(el); });
	while (datas.ARRAY.length > 0)
		datas.ARRAY.pop();
	datas.ARRAY = null; //freed

	// get the user's customization from the localstorage
	var persoSaved = localStorage.getItem(vibrations[datas.CUSTOM].name);

	if (persoSaved !== null)
		vibrations[datas.CUSTOM] = Vibration.createVibes(JSON.parse(persoSaved));
	persoSaved = null; // freed
	var listvibes = new ListVibes(vibrations[datas.CUSTOM]); // we load it

	// insert the buttons in the webpage
	var ul = document.createElement("ul"), li, button;
	ul.classList.add("buttonList");
	
	for (i = 0; i < datas.LENGTH; i++)
	{
		li = document.createElement("li");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute("id", "b" + i);
		button.classList.add("unactive");
		button.appendChild(document.createTextNode(vibrations[i].name));
		button.addEventListener("click", startVibrations);
		li.appendChild(button);
		ul.appendChild(li);
	}
	document.querySelector("#buttons").appendChild(ul);

	// setup UI
		// battery
	var battery = document.querySelector("#battery button"); // the place where display the battery level
	if (navigator.battery)
	{
		navigator.battery.addEventListener("chargingchange", updateBatteryStatus);
		navigator.battery.addEventListener("levelchange", updateBatteryStatus);
		updateBatteryStatus();
	}
	else
		battery.innerHTML = "?";
		// buttons
	var helpbtn = document.querySelector("#helpbtn"); // button "?"
	var contentsec = document.querySelector("#contents"); // main section
	var helpsec = document.querySelector("#helpsec"); // help section
	var customsec = document.querySelector("#customization"); // customization section

	var howtobtn = document.querySelector("#howtobtn"); // button howto in the help section
	var aboutbtn = document.querySelector("#aboutbtn"); // button about in the help section
	var howtosec = document.querySelector("#howto"); // howto section in the help section
	var aboutsec = document.querySelector("#about"); // about section in the help section
	
	helpbtn.addEventListener("click", onHelpClick);
	howtobtn.addEventListener("click", onHowtoClick);
	aboutbtn.addEventListener("click", onAboutClick);
	document.querySelector("#save").addEventListener("click", onDisplayMain);
	// custom buttons
	document.querySelector("#save").addEventListener("click", onSaveCustom);
	document.querySelector("#cancel").addEventListener("click", onCancelCustom);
	document.querySelector("#addVibes").addEventListener("click", listvibes.addVibes);
	document.querySelector("#stopbtn").addEventListener("click", stopVibrations);

	// callbacks for UI actions
		// battery
	/** update the battery state */
	function updateBatteryStatus ()
	{
		if (navigator.battery.charging)
			battery.innerHTML = "plugged";
		else
			battery.innerHTML = Math.round(navigator.battery.level * 100) + "%";
	}

		// buttons
	var displayedSection = contentsec;
	var lastDisplayedSection = displayedSection;

	/** display the help section */
	function onHelpClick ()
	{
		if (displayedSection === helpsec) // hide the help section
		{
			helpsec.classList.add("hidden");
			displayedSection = lastDisplayedSection;
			displayedSection.classList.remove("hidden");
			lastDisplayedSection = helpsec;
			helpbtn.classList.remove("active");
		}
		else // display the help section
		{
			displayedSection.classList.add("hidden");
			lastDisplayedSection = displayedSection;
			displayedSection = helpsec;
			helpsec.classList.remove("hidden");
			helpbtn.classList.add("active");
			onHowtoClick();
		}
	}

	/** display the customization section */
	function onCustomizationClick ()
	{
		stopVibrations();
		displayedSection.classList.add("hidden");
		lastDisplayedSection = displayedSection;
		displayedSection = customsec;
		customsec.classList.remove("hidden");
	}

	/** display the main (contents) section */
	function onDisplayMain ()
	{
		displayedSection.classList.add("hidden");
		lastDisplayedSection = displayedSection;
		displayedSection = contentsec;
		contentsec.classList.remove("hidden");
	}

	/** in the help section, display the howto article */
	function onHowtoClick ()
	{
		if (!howtobtn.classList.contains("active")) // button not already active
		{
			howtobtn.classList.add("active");
			aboutbtn.classList.remove("active");
			aboutsec.classList.add("hidden");
			howtosec.classList.remove("hidden");
		}
	}

	/** in the help section, display the about article */
	function onAboutClick ()
	{
		if (!aboutbtn.classList.contains("active")) // button not already active
		{
			aboutbtn.classList.add("active");
			howtobtn.classList.remove("active");
			howtosec.classList.add("hidden");
			aboutsec.classList.remove("hidden");
		}
	}

	// custom buttons
	/** save the custom vibration in local storage, load it and show the main screen */
	function onSaveCustom ()
	{
		vibrations[datas.CUSTOM] = listvibes.onSave();
		localStorage.setItem(vibrations[datas.CUSTOM].name, JSON.stringify(vibrations[datas.CUSTOM]));
		stopVibrations();
		document.querySelector("#b" + datas.CUSTOM).click();
		onDisplayMain();
	}

	/** reset the custom gui and return to the main screen */
	function onCancelCustom ()
	{
		listvibes.onCancel();
		onDisplayMain();
	}

	// callbacks functions
	var currentVib = null; // the current object Vibration running. if none, === null
	var currentButton = null; // the current button in action (null if none)
	var anim = document.querySelector("#main"); // the animation to run
	var description = document.querySelector("#description"); // where to write the description of a button

	/** start to vibrate after a click on a button */
	function startVibrations (event)
	{
		var index = parseInt(event.target.getAttribute("id").slice(1), 10);

		if (currentButton !== null || currentVib !== null)
			stopVibrations();
		currentButton = event.target;
		currentVib = vibrations[index];

		currentButton.removeEventListener("click", startVibrations);
		currentButton.addEventListener("click", stopVibrations);
		currentButton.classList.remove("unactive");
		currentButton.classList.add("active");
		anim.classList.add("vibrate");
		description.innerHTML = currentVib.description;
		if (index === datas.CUSTOM)
			description.addEventListener("click", onCustomizationClick);
		if (index === datas.MMH)
			currentVib.startVibrationRandom(); // set idInterval in it
		else
			currentVib.startVibration();
	}

	/** ends the vibration */
	function stopVibrations ()
	{
		if (currentVib !== null)
			currentVib.stopVibration();
		description.removeEventListener("click", onCustomizationClick);
		if (currentButton !== null)
		{
			currentButton.removeEventListener("click", stopVibrations);
			currentButton.addEventListener("click", startVibrations);
			currentButton.classList.remove("active");
			currentButton.classList.add("unactive");
		}
		anim.classList.remove("vibrate");
		description.innerHTML = "";
		currentButton = null;
		currentVib = null;
	}
})();

