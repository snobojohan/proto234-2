/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'metecons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-sunrise' : '&#xe000;',
			'icon-sun' : '&#xe001;',
			'icon-moon' : '&#xe002;',
			'icon-sun-2' : '&#xe003;',
			'icon-windy' : '&#xe004;',
			'icon-wind' : '&#xe005;',
			'icon-snowflake' : '&#xe006;',
			'icon-cloudy' : '&#xe007;',
			'icon-cloud' : '&#xe008;',
			'icon-weather' : '&#xe009;',
			'icon-weather-2' : '&#xe00a;',
			'icon-weather-3' : '&#xe00b;',
			'icon-lines' : '&#xe00c;',
			'icon-cloud-2' : '&#xe00d;',
			'icon-lightning' : '&#xe00e;',
			'icon-lightning-2' : '&#xe00f;',
			'icon-rainy' : '&#xe010;',
			'icon-rainy-2' : '&#xe011;',
			'icon-windy-2' : '&#xe012;',
			'icon-windy-3' : '&#xe013;',
			'icon-snowy' : '&#xe014;',
			'icon-snowy-2' : '&#xe015;',
			'icon-snowy-3' : '&#xe016;',
			'icon-weather-4' : '&#xe017;',
			'icon-cloudy-2' : '&#xe018;',
			'icon-cloud-3' : '&#xe019;',
			'icon-lightning-3' : '&#xe01a;',
			'icon-sun-3' : '&#xe01b;',
			'icon-moon-2' : '&#xe01c;',
			'icon-cloudy-3' : '&#xe01d;',
			'icon-cloud-4' : '&#xe01e;',
			'icon-cloud-5' : '&#xe01f;',
			'icon-lightning-4' : '&#xe020;',
			'icon-rainy-3' : '&#xe021;',
			'icon-rainy-4' : '&#xe022;',
			'icon-windy-4' : '&#xe023;',
			'icon-windy-5' : '&#xe024;',
			'icon-snowy-4' : '&#xe025;',
			'icon-snowy-5' : '&#xe026;',
			'icon-weather-5' : '&#xe027;',
			'icon-cloudy-4' : '&#xe028;',
			'icon-lightning-5' : '&#xe029;',
			'icon-thermometer' : '&#xe02a;',
			'icon-compass' : '&#xe02b;',
			'icon-none' : '&#xe02c;',
			'icon-Celsius' : '&#xe02d;',
			'icon-Fahrenheit' : '&#xe02e;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};