function DownloadAssistant(u) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   this.url=u;
	   this.downloadDone=false;
	   if(u.indexOf("zhephree.com/neato/getfile.php")>-1){
	   	this.downloadfile=true;
	   }else{
	   	this.downloadfile=false;
	   }
}

DownloadAssistant.prototype.setup = function() {
  this.controller.setupWidget("downloadURL",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Download",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("downloadURL"),Mojo.Event.tap,this.download.bind(this));

  this.controller.setupWidget("launchURL",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Launch",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("launchURL"),Mojo.Event.tap,this.launch.bind(this));

    this.controller.setupWidget("progress",
        this.progressAttributes = {
            title: "Downloading..."
        },
        this.progressModel = {
            value: 0,
            disabled: false
        }
    ); 
  Mojo.Event.listen(this.controller.get("progress"),Mojo.Event.tap,this.launchFile.bind(this));
      
      

  this.controller.get("url").innerHTML=this.url;
  this.handleURL=launchURL.bind(this);
  
  
};

DownloadAssistant.prototype.download = function(event) {
	logthis("download...");
	if(!this.downloadfile){
	
		this.controller.get("progress").style.visibility="visible";
		this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
			method: 'download', 
			parameters: 
			{
				target: this.url,
				targetDir : "/media/internal/neato/",
				keepFilenameOnRedirect: true,
				subscribe: true
			},
			onSuccess : function (resp){
				logthis(Object.toJSON(resp));
				if(resp.amountReceived!=undefined){
					var pc=resp.amountReceived/resp.amountTotal;
					logthis("pc="+pc);
					this.progressModel.value=pc;
					this.controller.modelChanged(this.progressModel);
				}
				if(resp.completed!=undefined){
					if(resp.completed){
						this.progressAttributes.title="Tap to launch";
						this.controller.modelChanged(this.progressModel);
						this.downloadDone=true;
						this.fileName=resp.target;
					}
				}
			}.bind(this),
			onFailure : function (e){logthis(Object.toJSON(e))}
		});
	}else{

	}
};

DownloadAssistant.prototype.launchFile = function(event) {
	if(this.downloadDone){
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			 method: 'open',
			 parameters: {
				 target: this.fileName
			 }
		});
	}
};


DownloadAssistant.prototype.launch = function(event) {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			 method: 'open',
			 parameters: {
				 target: this.url
			 }
		});
};

DownloadAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

DownloadAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

DownloadAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
