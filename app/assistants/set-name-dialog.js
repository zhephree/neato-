function SetNameDialogAssistant(sceneAssistant,setObject) {
  this.sceneAssistant = sceneAssistant;
  this.setObject=setObject;
}
SetNameDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  // Setup button and event handler
  this.sceneAssistant.controller.setupWidget("saveButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKButtonModel = {
      buttonLabel: "Save",
      disabled: false
    }
  );
  this.saveTappedBound=this.saveTapped.bindAsEventListener(this);

	Mojo.Event.listen(this.sceneAssistant.controller.get('saveButton'), Mojo.Event.tap, this.saveTappedBound);
  
	this.sceneAssistant.controller.setupWidget('nameField', this.fcAttributes = {hintText:'Enter your name...',multiline:false,focus:true},
	 this.ynModel = {value:'', disabled:false});
}

SetNameDialogAssistant.prototype.activate = function() {
	this.sceneAssistant.controller.get('nameField').mojo.focus();
}


SetNameDialogAssistant.prototype.saveTapped = function() {
	logthis("oktapped");
/*    this.cookieData=new Mojo.Model.Cookie("yourname");
	var acCookie=this.cookieData.get();
	var yourname=(acCookie)? acCookie.yourname: true;*/
		this.cookieData=new Mojo.Model.Cookie("yourname");
		this.cookieData.put(
			{"yourname":this.ynModel.value}
		);
		
		_globals.name=this.ynModel.value;
		if(this.setObject){
			this.sceneAssistant.controller.get("yourname").update(this.ynModel.value);
		}
		
		this.widget.mojo.close();

}


SetNameDialogAssistant.prototype.cleanup = function() {
	Mojo.Event.stopListening(this.sceneAssistant.controller.get('saveButton'), Mojo.Event.tap, this.saveTappedBound);

}
