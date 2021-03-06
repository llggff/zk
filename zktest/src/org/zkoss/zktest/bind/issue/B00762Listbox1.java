/* ListboxModelVM.java

	Purpose:
		
	Description:
		
	History:
		Created by Dennis

Copyright (C) 2011 Potix Corporation. All Rights Reserved.
 */

package org.zkoss.zktest.bind.issue;

import java.util.ArrayList;
import java.util.List;

import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.NotifyChange;

/**
 * @author Dennis Chen
 * 
 */
public class B00762Listbox1 {
	private String message1;

	List<Item> items;
	Item selected;

	public B00762Listbox1() {
		items = new ArrayList<Item>();
		items.add(new Item("A"));
		items.add(new Item("B"));
		items.add(new Item("C"));
		items.add(new Item("D"));
	}

	public List<Item> getItems() {
		return items;
	}

	public Item getSelected() {
		return selected;
	}

	public void setSelected(Item selected) {
		this.selected = selected;
	}

	public String getMessage1() {
		return message1;
	}

	static public class Item {
		String name;
		
		List<String> options = new ArrayList<String>();

		public Item(String name) {
			this.name = name;
			options.add(name+" 0");
			options.add(name+" 1");
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public List<String> getOptions() {
			return options;
		}
	}

	@Command @NotifyChange({"items","message1"}) 
	public void reload() {
		message1 = "reloaded "+ (selected==null?"no selection":selected.name);
	}
	@Command @NotifyChange({"selected","message1"}) 
	public void select() {
		message1 = "select";
		selected = items.get(1);
	}
	@Command @NotifyChange({"selected","message1"}) 
	public void clean() {
		message1 = "clean";
		selected = null;
	}

}
