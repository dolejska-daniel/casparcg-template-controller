window["TemplateController"] = Template.Controller.GetInstance(document.location.hash === "#debug");


//=====================================================================dd==
//  CASPARCG NATIVE INTERFACE
//=====================================================================dd==

function play() {
    TemplateController.Play();
}

function next() {
    TemplateController.Next();
}

function update(d) {
    if (d) {
        try {
            d = JSON.parse(d);
        } catch (e) {
	        console.error("UPDATE command received malformed data. Only JSON is supported. (" + e + ")");
	        return;
        }
	    TemplateController.Update(d);
    }
}

function stop() {
    TemplateController.Stop();
}