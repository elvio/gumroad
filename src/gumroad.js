import Link from "./link"
import Overlay from "./overlay"

function Gumroad(domains, domain) {  
  this.link = new Link(domains);
  this.overlay = new Overlay(domain);

  this.link.clicked((permalink) => {
    this.overlay.show(permalink);
  });
}

Gumroad.init = function() {
  new Gumroad(["gumroad.com", "gum.co"], "gumroad.com");
}

window.addEventListener ? window.addEventListener("load", Gumroad.init()) : window.attachEvent && window.attachEvent("onload", Gumroad.init());