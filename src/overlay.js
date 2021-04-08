function Overlay(domain) {
    this.domain = domain;
    this.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");

    this.listenToMessages();
    this.appendStylesheet();
}

Overlay.prototype.listenToMessages = function() {
    window.addEventListener("message", (e) => {
        var message = {};

        if (e.data) {
            try {
                message = JSON.parse(e.data);
            } catch (i) {            
            }
        }

        this.handleMessage(message);
    });
}

Overlay.prototype.appendStylesheet = function() {
    let css = 'a.gumroad-button { background-color: white !important; background-image: url("https://gumroad.com/button/button_bar.jpg") !important; background-repeat: repeat-x !important; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.4) 0 0 2px !important; color: #999 !important; display: inline-block !important; font-family: -apple-system, ".SFNSDisplay-Regular", "Helvetica Neue", Helvetica, Arial, sans-serif !important; font-size: 16px !important; font-style: normal !important; font-weight: 500 !important; line-height: 50px !important; padding: 0 15px !important; text-shadow: none !important; text-decoration: none !important; } .gumroad-scroll-container { -webkit-overflow-scrolling: touch; overflow-y: auto; position: fixed !important; z-index: 99998 !important; top: 0 !important; right: 0 !important; -ms-overflow-style: none; scrollbar-width: none; text-align: start; } .gumroad-scroll-container::-webkit-scrollbar { display: none; } .gumroad-overlay-iframe { position: absolute; min-width: 100%; min-height: 100%; border: none !important; } .gumroad-scroll-container { width: 100%; height: 100% }';

    let styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(css));

    document.getElementsByTagName("head")[0].appendChild(styleElement);
}

Overlay.prototype.handleMessage = function(message) {
    if (message.parentMethod === "handshake") {
        this.stopHandshake();
    }

    if (message.parentMethod === "minimizeIframe") {
        this.close();
    }
}

Overlay.prototype.startHandshake = function() {
    this.handshaked = false;
    this.handshakeInterval = setInterval(() => {        
        this.postIframeMessage({overlayArgs: this.origin, overlayMethod: "setOverlayParentDomain"});
    }, 100);    
}

Overlay.prototype.stopHandshake = function() {
    this.handshaked = true;
    clearInterval(this.handshakeInterval);
}

Overlay.prototype.getProduct = function(permalink) {
    this.postIframeMessage({
        overlayMethod: "getProduct",
        overlayArgs: {
            as_modal: true,
            offerCodeName: null,
            permalink: permalink, 
            referrer: this.origin
        }
    }, true);    
}

Overlay.prototype.postIframeMessage = function(message, waitHandshake=false) {
    if (waitHandshake && !this.handshaked) {
        setTimeout(() => {
            this.postIframeMessage(message, waitHandshake);
        }, 200);
    } else {
        let url = window.location.protocol + "//" + this.domain;
        this.iframe && this.iframe.contentWindow.postMessage(JSON.stringify(message), url);
    }
}

Overlay.prototype.close = function() {
    this.scrollContainer.removeChild(this.iframe);
    this.scrollContainer.parentElement.removeChild(this.scrollContainer);
    delete this.iframe;
}

Overlay.prototype.show = function(permalink) {
    this.scrollContainer = document.createElement("div");
    this.scrollContainer.className = "gumroad-scroll-container";
    document.getElementsByTagName("body")[0].appendChild(this.scrollContainer);

    this.iframe = document.createElement("iframe")
    this.iframe.setAttribute("scrolling", "no")
    this.iframe.setAttribute("allowFullScreen", "allowfullscreen")
    this.iframe.allowtransparency = true
    this.iframe.className = "gumroad-overlay-iframe"

    this.scrollContainer.appendChild(this.iframe);    

    this.iframe.onload = () => {      
        this.startHandshake();
        this.getProduct(permalink);
    }

    this.iframe.onerror = () => {
        this.close();
    }

    this.iframe.src = this.buildIframeSrc(permalink);
}

Overlay.prototype.buildIframeSrc = function(permalink) {
    return `https://${this.domain}/overlay_page?single_product_mode=true&all_permalinks=${permalink}`
}

export default Overlay;