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
 * simulates the tap event and bind it on click event, to make it feel native
 */
(function ()
{
	var point = { x: -1, y: -1 };

	function onStart (e)
	{
		if (e.touches.length === 1)
		{
			e.preventDefault();
			point.x = e.touches[0].pageX;
			point.y = e.touches[0].pageY;
		}
		else
			point = { x: -1, y: -1 };
	}

	function onEnd (e)
	{
		if (point.x !== -1 && point.y !== -1)
			e.target.click();
		point = { x: -1, y: -1 };
	}

	function onCancel (e)
	{
		e.preventDefault();
		point = { x: -1, y: -1 };
	}

	window.onClick = function (element, action)
	{
		element.addEventListener("click", action);
		element.addEventListener("touchstart", onStart);
		element.addEventListener("touchend", onEnd);
		element.addEventListener("touchmove", onCancel);
		element.addEventListener("touchcancel", onCancel);
		element.addEventListener("contextmenu", onCancel);
	}

	window.removeClick = function (element, action)
	{
		element.removeEventListener("click", action);
		element.removeEventListener("touchstart", onStart);
		element.removeEventListener("touchend", onEnd);
		element.removeEventListener("touchmove", onCancel);
		element.removeEventListener("touchcancel", onCancel);
		element.removeEventListener("contextmenu", onCancel);
	}
})();

