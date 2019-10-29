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
            TemplateController.Update(d);
        } catch (e) {
            console.error("UPDATE command received malformed data. Only JSON is supported.");
        }
    }
}

function stop() {
    TemplateController.Stop();
}