/* splt.js

{{IS_NOTE
	Purpose:
		Splitter
	Description:
		
	History:
		Sat Jun 10 12:42:15     2006, Created by tomyeh@potix.com
}}IS_NOTE

Copyright (C) 2006 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
function zkSplt() {}

zkSplt._drags = {};
zkSplt.init = function (cmp) {
	if (zk.agtIe) cmp.onselectstart = function () {return false;}
	else if (zk.agtNav) cmp.style["-moz-user-select"] = "none";

	var snap = function (x, y) {return zkSplt._snap(cmp, x, y);};
	var vert = cmp.getAttribute("zk_vert");
	zkSplt._drags[cmp.id] = {
		vert: vert,
		drag: new Draggable(cmp, {
			constraint: vert ? "vertical": "horizontal",
			snap: snap,
			starteffect: zkSplt._startDrag, change: zkSplt._dragging,
			endeffect: zkSplt._endDrag})
	};

	var btn = $(cmp.id + "!btn");
	Event.observe(btn, "click", function () {
		zkSplt.open(cmp, cmp.getAttribute("zk_open") == "false");
	});

	cmp.style.backgroundImage = "url(" +zk.getUpdateURI(
		"/web/zul/img/splt/"+(vert?"v":"h")+"splt.gif") + ")";

	zkSplt._fixbtn(cmp);

	var exc = "zkSplt._resize('" + cmp.id + "')";
	Event.observe(window, "resize", function () {setTimeout(exc, 120);});
	setTimeout(exc, 120);

	cmp.style.cursor = "move";
	btn.style.cursor = "default";
};
zkSplt.cleanup = function (cmp) {
	var drag = zkSplt._drags[cmp.id];
	if (drag) {
		zkSplt._drags[cmp.id] = null;
		drag.drag.destroy();
	}
};
zkSplt.setAttr = function (cmp, nm, val) {
	if ("zk_open" == nm) {
		zkSplt.open(cmp, val == "true", true);
		return true; //no need to store the zk_open attribute
	}
	return false;
};

zkSplt._resize = function (cmp) {
	cmp = $(cmp);
	if (cmp) {
		zkSplt._fixsz(cmp);

		//we have to convert auto-adjust to fix-width, or table
		//will affect the sliding
		var nd = $(cmp.id + "!chdextr");
		var tn = zk.tagName(nd);
		var vert = cmp.getAttribute("zk_vert");
		for (nd = nd.parentNode.firstChild; nd; nd = nd.nextSibling)
			if (tn == zk.tagName(nd))
				if (vert) nd.style.height = nd.offsetHeight + "px";
				else nd.style.width = nd.offsetWidth + "px";
	}
};
zkSplt._fixbtn = function (cmp) {
	var btn = $(cmp.id + "!btn");
	var colps = cmp.getAttribute("zk_colps")
	if (!colps || "none" == colps) {
		btn.style.display = "none";
	} else {
		var vert = cmp.getAttribute("zk_vert");
		var before = colps == "before";
		if (cmp.getAttribute("zk_open") == "false") before = !before;
		btn.src = zk.renType(btn.src,
			vert ? before ? 't': 'b': before ? 'l': 'r');
		btn.style.display = "";
	}
};
zkSplt._startDrag = function (cmp) {
	var drag = zkSplt._drags[cmp.id];
	if (drag) {
		var run = drag.run = {};
		run.org = Position.cumulativeOffset(cmp);
		var nd = $(cmp.id + "!chdextr");
		var tn = zk.tagName(nd);
		run.prev = zk.previousSibling(nd, tn);
		run.next = zk.nextSibling(nd, tn);
		run.box = zkau.getParentByType(nd, "Box");
	}
};
zkSplt._endDrag = function (cmp) {
	cmp.style.left = cmp.style.top = "";
		//reset since table might adjust width later

	var drag = zkSplt._drags[cmp.id];
	if (drag) drag.run = null; //free memory
};
zkSplt._snap = function (cmp, x, y) {
	var drag = zkSplt._drags[cmp.id];
	if (drag) {
		var run = drag.run;
		var ofs = Position.cumulativeOffset(run.box);
		ofs = zk.toStylePos(cmp, ofs[0], ofs[1]);
		if (drag.vert) {
			if (y <= ofs[1]) {
				y = ofs[1];
			} else {
				var max = ofs[1] + run.box.clientHeight - cmp.offsetHeight;
				if (y > max) y = max;
			}
		} else {
			if (x <= ofs[0]) {
				x = ofs[0];
			} else {
				var max = ofs[0] + run.box.clientWidth - cmp.offsetWidth;
				if (x > max) x = max;
			}
		}
	}
	return [x, y];
};
zkSplt._dragging = function (drag) {
	var cmp = drag.element;
	if (cmp.getAttribute("zk_open") == "false") return;
		//not draggable (or, user won't see the effect)

	var drag = zkSplt._drags[cmp.id];
	if (drag) {
		var run = drag.run;
		var ofs = Position.cumulativeOffset(cmp);
		if (drag.vert) {
			var diff = ofs[1] - run.org[1];
			if (run.next) zkSplt._adj(run.next, "height", -diff);
			if (run.prev) zkSplt._adj(run.prev, "height", diff);
		} else {
			var diff = ofs[0] - run.org[0];
			if (run.next) zkSplt._adj(run.next, "width", -diff);
			if (run.prev) zkSplt._adj(run.prev, "width", diff);
		}
		run.org = ofs;

		zkSplt._fixszAll();
			//fix all splitter's size because table might be with %
	}
};
zkSplt._adj = function (n, fd, diff) {
	zkSplt._adjSplt(n, fd, diff);
	if (n) {
		var val = parseInt(n.style[fd] || "0") + diff;
		n.style[fd] = (val > 0 ? val: 0) + "px";
	}
};
/** Adjusts the width of the splitter in the opposite dir. */
zkSplt._adjSplt = function (n, fd, diff) {
	if (zk.getCompType(n) == "Splt") {
		var vert = n.getAttribute("zk_vert") != null;
		if (vert != (fd == "height")) {
			var val = parseInt(n.style[fd] || "0") + diff;
			n.style[fd] = (val > 0 ? val: 0) + "px";
		}
	}
	for (n = n.firstChild; n; n = n.nextSibling)
		zkSplt._adjSplt(n, fd, diff);
};
/** Fixes the height (wd) of the specified splitter. */
zkSplt._fixsz = function (cmp) {
	var vert = cmp.getAttribute("zk_vert");
	var parent = cmp.parentNode;
	if (parent) {
		//Note: when window resize, it might adjust splitter's wd (hgh)
		//if box's width is nn%. So we have to reset it to 8px
		if (vert) {
			parent = parent.parentNode; //TR
			cmp.style.height = parent.style.height = "8px";
			cmp.style.width = parent.clientWidth + "px";
		} else {
			cmp.style.width = parent.style.width = "8px";
			cmp.style.height = parent.clientHeight + "px";
		}
	}

	var btn = $(cmp.id + "!btn");
	if (vert) btn.style.marginLeft = ((cmp.offsetWidth - btn.offsetWidth) / 2)+"px";
	else btn.style.marginTop = ((cmp.offsetHeight - btn.offsetHeight) / 2)+"px";
};
zkSplt._fixszAll = function () {
	for (var id in zkSplt._drags) {
		var cmp = $(id);
		if (cmp) zkSplt._fixsz(cmp);
	}
};

zkSplt.open = function (cmp, open, silent) {
	var nd = $(cmp.id + "!chdextr");
	var tn = zk.tagName(nd);
	if ((cmp.getAttribute("zk_open") != "false") == open) return; //nothing changed

	var colps = cmp.getAttribute("zk_colps")
	if (!colps || "none" == colps) return; //nothing to do

	var vert = cmp.getAttribute("zk_vert");
	var sib = colps == "before" ?
		zk.previousSibling(nd, tn): zk.nextSibling(nd, tn);
	if (sib) action.show(sib, open);
	cmp.setAttribute("zk_open", open ? "true": "false");

	zkSplt._fixbtn(cmp);
	zkSplt._fixszAll();

	if (!silent)
		zkau.send({uuid: cmp.id, cmd: "onOpen", data: [open]},
			zkau.asapTimeout(cmp, "onOpen"));
};
