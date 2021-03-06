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
document.l10n.addEventListener("warning", function (error) { console.log("warn: " + error.message); });
document.l10n.addEventListener("error", function (error) { console.log("err: " + error.message); });
document.l10n.addEventListener("ready", main);
function main ()
{
	"use strict";
	// global variables for the script
	var vibrations; // the different objects Vibration stored in datas.json
	var i;

	// wait for translation
		// done at the beginning of the file
	document.l10n.removeEventListener("ready", main);
	document.l10n.localize(["language"], function(l10n){
		if (l10n.entities.language.value != null)
			document.querySelector("html").setAttribute("lang", l10n.entities.language.value);
	}); // will be called each time the language changes

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
		button.setAttribute("data-l10n-id", vibrations[i].name + "Name")
		button.classList.add("unactive");
		button.appendChild(document.createTextNode(vibrations[i].name));
		onClick(button, startVibrations);
		document.l10n.localizeNode(button);
		if (button.textContent === "" || button.textContent === vibrations[i].name + "Name") // this is strange, due to localizeNode()
			button.textContent = vibrations[i].name;
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
	{
		battery.setAttribute("data-l10n-id", "batteryUnknown");
		document.l10n.localizeNode(battery);
	}
		// buttons
	var helpbtn = document.querySelector("#helpbtn"); // button "?"
	var contentsec = document.querySelector("#contents"); // main section
	var helpsec = document.querySelector("#helpsec"); // help section
	var customsec = document.querySelector("#customization"); // customization section
	var stopbtn = document.querySelector("#stopbtn"); // stop button

	var howtobtn = document.querySelector("#howtobtn"); // button howto in the help section
	var aboutbtn = document.querySelector("#aboutbtn"); // button about in the help section
	var howtosec = document.querySelector("#howto"); // howto section in the help section
	var aboutsec = document.querySelector("#about"); // about section in the help section

	onClick(helpbtn, onHelpClick);
	onClick(howtobtn, onHowtoClick);
	onClick(aboutbtn, onAboutClick);
	onClick(stopbtn, stopVibrations);
	// custom buttons
	onClick(document.querySelector("#save"), onSaveCustom);
	onClick(document.querySelector("#cancel"), onCancelCustom);
	onClick(document.querySelector("#addVibes"), listvibes.addVibes);

	// callbacks for UI actions
		// battery
	/** update the battery state */
	function updateBatteryStatus ()
	{
		if (navigator.battery.charging)
		{
			battery.setAttribute("data-l10n-id", "batteryCharging");
			document.l10n.localizeNode(battery);
		}
		else
		{
			battery.removeAttribute("data-l10n-id");
			battery.textContent = Math.round(navigator.battery.level * 100) + "%";
		}
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
		stopbtn.focus(); // to make the keyboard disappear
		stopbtn.blur();
	}

	/** reset the custom gui and return to the main screen */
	function onCancelCustom ()
	{
		listvibes.onCancel();
		onDisplayMain();
		stopbtn.focus(); // to make the keyboard disappear
		stopbtn.blur();
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

		removeClick(currentButton, startVibrations);
		onClick(currentButton, stopVibrations);
		currentButton.classList.remove("unactive");
		currentButton.classList.add("active");
		anim.classList.add("vibrate");
		// translation
		description.setAttribute("data-l10n-id", currentVib.name + "Descr");
		document.l10n.localizeNode(description);
		if (description.textContent === "" || description.textContent === currentVib.name + "Descr") // this is strange, due to localizeNode()
			description.textContent = currentVib.description;

		if (index === datas.CUSTOM)
			onClick(description, onCustomizationClick);
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
		removeClick(description, onCustomizationClick);
		description.removeAttribute("data-l10n-id");
		if (currentButton !== null)
		{
			removeClick(currentButton, stopVibrations);
			onClick(currentButton, startVibrations);
			currentButton.classList.remove("active");
			currentButton.classList.add("unactive");
		}
		anim.classList.remove("vibrate");
		description.textContent = "";
		currentButton = null;
		currentVib = null;
	}
}

