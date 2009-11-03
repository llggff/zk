/* menubar.js

	Purpose:

	Description:

	History:
		Thu Jan 15 09:03:04     2009, Created by jumperchen

Copyright (C) 2008 Potix Corporation. All Rights Reserved.

This program is distributed under LGPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
function (out) {
	var uuid = this.uuid;
	if ('vertical' == this.getOrient()) {
		out.push('<div', this.domAttrs_(), '><table id="', uuid, '-cave"',
				zUtl.cellps0, '>');
		for (var w = this.firstChild; w; w = w.nextSibling)
			this.encloseChildHTML_({out: out, child: w, vertical: true});
		out.push('</table></div>');
	} else {
		out.push('<div', this.domAttrs_(), '>')
		if (this.scrollable) {
			out.push('<div id="', this.uuid, '-left" class="', this.getZclass(), '-left"></div>');
			out.push('<div id="', this.uuid, '-right" class="', this.getZclass(), '-right"></div>');
			out.push('<div id="', this.uuid, '-body" class="', this.getZclass(), '-body">');
			out.push('<div id="', this.uuid, '-cnt" class="', this.getZclass(), '-cnt">');
		}
		out.push('<table', zUtl.cellps0, '>', '<tr valign="bottom" id="', uuid, '-cave">');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</tr></table>');
		if (this.scrollable) {
			out.push('</div></div>');
		}
		out.push('</div>');
	}
}