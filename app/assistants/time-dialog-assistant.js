function TimeDialogAssistant(sceneAssistant) {
  this.sceneAssistant = sceneAssistant;
}
TimeDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  // Setup button and event handler
  this.sceneAssistant.controller.setupWidget("okButton",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Set",
      disabled: false
    }
  );
  Mojo.Event.listen(this.sceneAssistant.controller.get('okButton'), Mojo.Event.tap, this.okTapped.bindAsEventListener(this));


	var currentTime = new Date();
	this.sceneAssistant.controller.setupWidget("timepickerId",
	    this.timeattributes = {
	        label: 'Time',
	        modelProperty: 'time'
	    },
	    this.timemodel = {
	        time: currentTime
	    }
	); 
}

TimeDialogAssistant.prototype.activate = function() {
	this.sceneAssistant.controller.get('newtip').mojo.focus();
}


TimeDialogAssistant.prototype.okTapped = function() {
	Mojo.Log.error("oktapped");
	var time=this.timemodel.time;
	this.sceneAssistant.time=time;
	this.sceneAssistant.valueModel.choices[0].label="is "+time.getHours()+":"+time.getMinutes();
	this.sceneAssistant.controller.modelChanged(this.sceneAssistant.valueModel);
	this.widget.mojo.close();
}

TimeDialogAssistant.prototype.cleanup = function() {
}
