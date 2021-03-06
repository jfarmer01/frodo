/**
 * VO class
 * TODO: Create an 'instance' property to store all of our 'public' properties.
 * return this in stringify.
 */

var VO = EventDispatcher.extend({
	
	__type__: "VO",
	name: "VO",
	_dispatchInterval:null,
	__renderClass__: null,
	renderClass: null,
	
	//Events
	CHANGED:"sdk.vo.changed",
	
	property: {},
	
	init: function () {
		this._super();
		this._dispatchInterval=null;
	},
	
	get : function (key) {
		return this[key];
	},
	
	set: function (key,val) {
		//this.debug("Setting VO property",key,val); 
		var dirty = false;

		// dont update if the value is the same
		if ( this[key] != val ) {
			this[key] = val;
			dirty = true;
		}
		
		// dispatch changed event
		if ( dirty ) {
			this._dispatchEvent(this.CHANGED, 
			{data:this, key:key, value:val}, 
			false);
		}
	},
	
	triggerChange: function() {
		// dispatch changed event
		this._dispatchEvent(this.CHANGED, 
		{data:this, key:null, value:null}, 
		false);
	},
	
	setValues: function(object) {
		// only call this if the change is indeed founded		
		if ( this.equals(object) ) {
			//TODO: extend causes really weird scope issues...
			// I know Matt hates loops, but I'm gonna go out on a limb
			// here and assume even tho this is a one line function call,
			// that internally, it's looping like a mofo anyway, as well
			// as doing some other wacky shit we don't need or want.
			//$.extend( true, this, object );
			for(var i in object) {
			//if we find we're losing events down the line,
			//  change this to this.set(i, object[i]);
				this[i] = object[i];
			}
			this._dispatchEvent(this.CHANGED, {
				data: this
			}, false);
		}
	},
	
	setRenderClass: function(renderClassName) {
		this.__renderClass__ = renderClassName;
		this.renderClass = eval(this.__renderClass__);
	},
	
	getSerializableData: function () {
		var temp = {};
		if ( this["__type__"] !== undefined ) {
			temp["__type__"] = this.__type__;
		}
		if (this["__renderClass__"] !== undefined ) {
			temp["__renderClass__"] = this.__renderClass__;
		}
		return temp;
	},
			
	stringify:function() {
		var temp = this.getSerializableData();
		return JSON.stringify(temp);
	},
	
	setSerializedData: function (data) {
		for(var a in data) {
			this[a] = data[a];
		}
		
		if (this["__renderClass__"] !== undefined && this.__renderClass__ != null) {
			this.setRenderClass(this.__renderClass__);
		}
	},
	
	destringify: function (stringData) {
		var data = JSON.parse(stringData);
		this.setSerializedData(data);	
	},
	
	equals: function (object) {
		return true;
	},
	
	_dispatchEvent:function() {
		return this.dispatchEvent.apply(this,arguments);
	}
});
