function AddTaskAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

AddTaskAssistant.prototype.setup = function() {
    this.controller.setupWidget("listCause",
        this.attributes = {
            choices: [
                {label: "Connection", value: 0},
                {label: "Headset", value: 1},
                {label: "Keyboard", value: 2},
                {label: "Ringer Switch", value: 3},
                {label: "Screen State", value: 4},
                {label: "Time", value: 5},
                {label: "GPS", value: 6}
            ],
            label: 'Cause'},
        this.model = {
            value: 0,
            disabled: false
        }
    ); 
    this.handleCC=this.handleCauseChange.bind(this);
	Mojo.Event.listen(this.controller.get("listCause"), Mojo.Event.propertyChange, this.handleCC);
    this.handleVC=this.handleValueChange.bind(this);
	Mojo.Event.listen(this.controller.get("listValue"), Mojo.Event.propertyChange, this.handleVC);
	
	this.values=[
		[
			{label: "WiFi Connected", value: "wifi-connected"},
			{label: "WiFi Disconnected", value: "wifi-disconnected"},
			{label: "WiFi on SSID", value: "wifi-ssid"},
			{label: "No Internet", value:"ica-false"},
			{label: "Internet Returns",value:"ica-true"}
		],
		[
			{label: "Plugged in", value: "down"},
			{label: "Unplugged", value: "up"},
			{label: "Button Hold", value: "hold"},
			{label: "Button Press", value: "single-click"},
			{label: "Button Double-Press", value: "double-click"}
		],
		[
			{label: "Slide Out", value: "down"},
			{label: "Slide In", value: "up"}
		],
		[
			{label: "On", value: "down"},
			{label: "Off", value: "up"}
		],
		[
			{label: "Turned On", value:"displayOn"},
			{label: "Turned Off", value:"displayOff"},
			{label: "Dimmed", value:"displayDimmed"}
		],
		[
			{label: "is", value: "time-is"}
		],
		[
			{label: "Position near", value: "near"},
			{label: "Direction is",value:"direction"},
			{label: "Velocity is",value:"velocity-is"},
			{label: "Velocity is less than",value:"velocity-less"},
			{label: "Velocity is more than",value:"velocity-more"},
			{label: "Altitude is",value: "altitude-is"},
			{label: "Altitude is less than",value: "altitude-less"},
			{label: "Altitude is higher than",value: "altitude-higher"},
		]
	];



    this.controller.setupWidget("listValue",
        this.valueAttributes = {
            label: 'Value'},
        this.valueModel = {
            choices: [

            ],
            disabled: false
        }
    ); 
    
    this.handleCauseChange({value:0});

    this.controller.setupWidget("listEffect",
        this.effectAttributes = {
            label: 'Effect'},
        this.effectModel = {
            choices: [
				{label:'Launch Application', value: 0},
				{label:'Display Banner', value: 1},
				{label:'Display Alert', value: 2},
				{label:'Play Sound', value: 3},
				{label:'Vibrate', value: 4},
				{label:'Set Wallpaper', value: 5},
				{label:'Set Ringtone', value: 6},
				{label:'Turn Airplane Mode On', value: 7},
				{label:'Turn Airplane Mode Off', value: 8},
				{label:'Send Tweet', value: 9},
				{label:'Launch Website', value: 10},
				{label:'Access URL', value: 11},
				{label:'Call Contact', value: 12},
				{label:'SMS Contact', value: 13},
				{label:'E-mail Contact', value: 14},
				{label:'Turn Screen On', value: 15},
				{label:'Turn Screen Off', value: 16},
				{label:'Wait', value: 17}

				
				
            ],
            disabled: false
        }
    ); 
	this.controller.setupWidget('textWhat', 
		this.attributes = {hintText:'',textCase: Mojo.Widget.steModeLowerCase}, 
		this.whatModel = {value:'', disabled:false}
	);

};

AddTaskAssistant.prototype.handleCauseChange = function(event) {
		this.valueModel.value='';
		this.valueModel.choices=this.values[event.value];
		this.controller.modelChanged(this.valueModel);
};

AddTaskAssistant.prototype.handleValueChange = function(event) {
	switch(event.value){
		case "time-is":
			this.controller.showDialog({
			    template: 'templates/dialog-time',
			    assistant: new TimeDialogAssistant(this),
			    preventCancel:true
			});
			break;
		case "direction":
			 this.controller.popupSubmenu({
             onChoose:function(val){
             	this.direction=val;
             	this.valueModel.choices[1].label="Direction is "+val;
             	this.controller.modelChanged(this.valueModel);
             }.bind(this),
             items: [
             	{label: "N", command: "N"},
             	{label: "NE", command: "NE"},
             	{label: "E", command: "E"},
             	{label: "SE", command: "SE"},
             	{label: "S", command: "S"},
             	{label: "SW", command: "SW"},
             	{label: "W", command: "W"},
             	{label: "NW", command: "NW"}
                    
                    ]
             });
			break;
	}
};

AddTaskAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

AddTaskAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

AddTaskAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
