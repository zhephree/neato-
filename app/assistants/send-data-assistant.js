function SendDataAssistant(t,fl) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   this.text=t;
	   this.fromLaunch=fl;


}

SendDataAssistant.prototype.aboutToActivate = function(callback){
	callback.defer();
logthis("abouttoactivate");
};

SendDataAssistant.prototype.setup = function() {
/*  this.controller.setupWidget("sendData",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKButtonModel = {
      buttonLabel: "Send Data",
      disabled: false
    }
  );

  
  Mojo.Event.listen(this.controller.get("sendData"),Mojo.Event.tap,this.sendData.bind(this));*/
logthis("setup");
	var os=Mojo.Environment.DeviceInfo.platformVersion;
	if(os.substr(0,2)=="1."){ //only show contact button for 1.4.x
		this.controller.get("attach-contact-button").show();
	}


  this.hasContact=false;
  Mojo.Event.listen(this.controller.get("send-data-button"),Mojo.Event.tap,this.sendData.bind(this));
  Mojo.Event.listen(this.controller.get("attach-contact-button"),Mojo.Event.tap,this.attachContact.bind(this));
  Mojo.Event.listen(this.controller.get("attach-file-button"),Mojo.Event.tap,this.attachFile.bind(this));

  this.controller.setupWidget('text-content', this.textAttributes = {multiline:true,focus:true,textCase:Mojo.Widget.steModeLowerCase}, this.textModel = {value:this.text, disabled:false});
  
	var l=[{label:"Computer",value:_globals.channel+"-pc"},{label:"FRIENDS"}];
	
	
	for(var f=0;f<_globals.friends.length;f++){
		l.push({label:_globals.friends[f].name,value:_globals.friends[f].channel});
	}
  
      this.controller.setupWidget("sendTo",
        this.sendtoAttributes = {
            choices: l,
            label: 'Send To'},

        this.sendtoModel = {
        value: _globals.channel+"-pc",
        disabled: false
        }
    );


	_globals.db.get("friends",
		function(r){
			if(r){ var a= r.friends;}
			if(!a){
				var a=[];
				_globals.friends=a;
				logthis("friends !a="+Object.toJSON(a));				
			}else{
				//load data
				logthis("friends has a="+Object.toJSON(a));
				_globals.friends=a;
			}
			var l=[{label:"Computer",value:_globals.channel+"-pc"},{label:"FRIENDS"}];
			
			
			for(var f=0;f<_globals.friends.length;f++){
				l.push({label:_globals.friends[f].name,value:_globals.friends[f].channel});
			}
			
			this.sendtoModel.choices=l;
			this.controller.modelChanged(this.sendtoModel);			
			//callback.defer();
		}.bind(this),
	
		function(r){
			_globals.friends=[];
			logthis("friends failed so setting to empty");
			var l=[{label:"Computer",value:_globals.channel+"-pc"},{label:"FRIENDS"}];
			
			
			for(var f=0;f<_globals.friends.length;f++){
				l.push({label:_globals.friends[f].name,value:_globals.friends[f].channel});
			}
			
			this.sendtoModel.choices=l;
			this.controller.modelChanged(this.sendtoModel);			
		}.bind(this)
	);


};

SendDataAssistant.prototype.sendData = function(event) {
	logthis("pubnub="+PUBNUB);
	var msg=encodeURIComponent('{"a":"text","c":"'+escape(this.textModel.value)+'","n":"'+escape(_globals.name)+'"}');
	 
	var fakeContact={"firstName": "Fred", "lastName": "Fredricks", "phoneNumbers": [{"value": "5045550001", "label": 3}, {"value": "504-555-1010", "label": 3}], "emailAddresses": [{"value": "fredf@gmail.com", "label": 0}, {"value": "ffredricks@uno.edu", "label": 2}, {"value": "5045551010@vtext.com", "label": 2}, {"value": "5045551010@vzwpix.com", "label": 2}]};

	logthis(this.textModel.value);


	if(this.textModel.value=="--fakecontact--"){
		logthis("fake");
		this.hasContact=true;
		this.contact=fakeContact;
	}

	if(this.sendtoModel.value!=_globals.channel+"-pc" && this.hasContact){
		c=encodeURIComponent(Object.toJSON(this.contact));
		msg=encodeURIComponent('{"a":"contact","c":"'+c+'","n":"'+escape(_globals.name)+'"}');
	}

	if(this.hasFile){
		var url = 'http://api.sendspace.com/rest/?method=anonymous.uploadGetInfo&api_version=1.0&api_key=RBIB80Y36W';
		var request = new Ajax.Request(url, {
		   method: 'get',
		   evalJSON: 'false',
		   onSuccess: function(r){
		   		Mojo.Controller.getAppController().showBanner("beginning upload...", {source: 'notification'});
		   		logthis(r.responseText);
				var xml=r.responseXML;
				var doc=xml.documentElement;
				var upload=doc.getElementsByTagName("upload")[0];
				var url=upload.getAttribute("url");
				var maxsize=upload.getAttribute("max_file_size");
				var identifier=upload.getAttribute("upload_identifier");
				var extra=upload.getAttribute("extra_info");
				
				logthis("done xml");
				
				var params=[];
				params.push({"key":"MAX_FILE_SIZE","data":maxsize,"contentType":"text/plain"});
				params.push({"key":"UPLOAD_IDENTIFIER","data":identifier,"contentType":"text/plain"});
				params.push({"key":"extra_info","data":extra,"contentType":"text/plain"});
				
				
				logthis("url="+url);
				this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
		            method: 'upload',
		            parameters: {
        			    'url': url,
		                'fileLabel': 'userfile',
        			    'fileName': this.fileName,
		                'postParameters': params,
        			    'subscribe': true
		            },
		            onSuccess: function (resp){
					 	//gonna old school parse the xml since it's in plain etxt and not an object...
				   		Mojo.Controller.getAppController().showBanner("upload complete!", {source: 'notification'});
				   		logthis("success");
						logthis(resp.responseString);
					 	
					 	var xml=resp.responseString;
					 	if(xml) {
						 	if(xml.indexOf('<status>ok')>-1) {
						 		var ps=xml.indexOf("<download_url>")+14;
						 		var pe=xml.indexOf("</download_url>");
						 		var len=pe-ps;
						 		var url=xml.substring(ps,pe);

								logthis("url="+url);
								
								var msg=encodeURIComponent('{"a":"url","c":"'+escape(url)+'","n":"'+escape(_globals.name)+'"}');
							 	
								PUBNUB.publish({
								    channel  : this.sendtoModel.value,
								    message  : msg,
								    callback : function(info) {
								        // info[0] == 1 for success
								        // info[0] == 0 for failure
								        // info[1] == "D" for "Demo Success" or
								        // info[1] == "S" for "Success with Valid Key" or
								        // info[1] == "Error..." with reason of failure.
								        // if the respons is an error, do not re-publish
								        // the failed publish will re-send automatically
							//	        console.log(info);
							
										if(info[0]==1 || info[0]=="1"){
									   		//logthis(r.responseText);
									   		if(this.fromLaunch==true){
								   				Mojo.Controller.getAppController().closeStage("mainStage");
											}else{
										   		this.controller.stageController.popScene();
										   	}
									   		Mojo.Controller.getAppController().showBanner("neato! message sent!", {source: 'notification'});
										}else{
									   		this.controller.get('sendData').mojo.deactivate();
									   		Mojo.Controller.getAppController().showBanner("error sending! retrying...", {source: 'notification'});			   				
										}
							
								    }.bind(this)
								});
								
					 		}
					 	}
						
					 	
				  	}.bind(this),
		            onFailure: function (e){
				   		Mojo.Controller.getAppController().showBanner("error uploading", {source: 'notification'});
  						logthis('Failure : ' + Object.toJSON(resp));
				 	}.bind(this)
		        });
				
		   }.bind(this),
		   onFailure: function(){
		   		Mojo.Controller.getAppController().showBanner("neato! error getting url", {source: 'notification'});			   
		   }.bind(this)
		 });

	}else{
		PUBNUB.publish({
		    channel  : this.sendtoModel.value,
		    message  : msg,
		    callback : function(info) {
		        // info[0] == 1 for success
		        // info[0] == 0 for failure
		        // info[1] == "D" for "Demo Success" or
		        // info[1] == "S" for "Success with Valid Key" or
		        // info[1] == "Error..." with reason of failure.
		        // if the respons is an error, do not re-publish
		        // the failed publish will re-send automatically
	//	        console.log(info);
	
				if(info[0]==1 || info[0]=="1"){
			   		//logthis(r.responseText);
			   		if(this.fromLaunch==true){
		   				Mojo.Controller.getAppController().closeStage("mainStage");
					}else{
				   		this.controller.stageController.popScene();
				   	}
			   		Mojo.Controller.getAppController().showBanner("neato! message sent!", {source: 'notification'});
				}else{
			   		this.controller.get('sendData').mojo.deactivate();
			   		Mojo.Controller.getAppController().showBanner("error sending! retrying...", {source: 'notification'});			   				
				}
	
		    }.bind(this)
		});
	}

};

SendDataAssistant.prototype.attachContact = function(event) {
	var os=Mojo.Environment.DeviceInfo.platformVersion;
	if(os.substr(0,2)=="1."){ //use old picker, or default to new picker
		this.controller.stageController.pushScene(
			{ appId :'com.palm.app.contacts', name: 'list' },
			{ mode: 'picker', message: "headerMessage"}
		); 
	}else{
	
	}

};

SendDataAssistant.prototype.attachFile = function(event) {
	Mojo.FilePicker.pickFile({'actionName':'Attach','defaultKind':'image','onSelect':function(fn){
		this.fileName=fn.fullPath;
		this.hasFile=true;
/*		if(fn.attachmentType=="image"){
			var icon="/var/luna/data/extractfs"+encodeURIComponent(this.fileName)+":0:0:150:150:2"
		}else{
			var icon=fn.iconPath;
		}*/
		this.file=this.fileName.match(/[-_\w]+[.][\w]+$/i)[0];
		this.controller.get("filename").update(this.file);
		this.controller.get("textrow").hide();
		this.controller.get("thefile").show();
//		logthis(Object.toJSON(fn));

	}.bind(this)},this.controller.stageController);

};

SendDataAssistant.prototype.activate = function(response) {
	//logthis(Object.toJSON(response));
	if(response){
		if(response.personId){ //handle repsonse from people picker
			var contact={
				firstName: response.details.record.firstName,
				lastName: response.details.record.lastName,
				phoneNumbers: [],
				emailAddresses: []
			}
			
			if(response.details.record.phoneNumbers){
				for(var p=0;p<response.details.record.phoneNumbers.length;p++){
					var phone={
						value: response.details.record.phoneNumbers[p].value,
						label: response.details.record.phoneNumbers[p].label
					};
					contact.phoneNumbers.push(phone);
				}
			}
			
			if(response.details.record.emailAddresses){
				for(var p=0;p<response.details.record.emailAddresses.length;p++){
					var email={
						value: response.details.record.emailAddresses[p].value,
						label: response.details.record.emailAddresses[p].label
					};
					contact.emailAddresses.push(email);
				}
			}
			
			this.contact=contact;
			this.hasContact=true;
			
			this.controller.get("contactName").update(contact.firstName+" "+contact.lastName);
			this.controller.get("contactIcon").writeAttribute("src","file://"+response.listPic);
			
			//logthis(Object.toJSON(contact));
			this.controller.get("thecontact").show();
			this.controller.get("textrow").hide();
			
			this.textModel.value='';
			this.controller.modelChanged(this.textModel.value);
		}
	}
};

SendDataAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SendDataAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
