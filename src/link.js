function Link(domains) {
    this.domains = domains;

    let anchors = document.getElementsByTagName("a");

    for (let a of anchors) {
        if (a.href) {
            let url = new URL(a.href);

            if (domains.includes(url.hostname)) {
                this.bindAnchor(a);
            }
        }
    }
}

Link.prototype.bindAnchor = function (anchor) {
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        let last = anchor.href.split("/").pop();
        let permalink = last.split("?")[0];
        this.callback && this.callback(permalink);
    });
}

Link.prototype.clicked = function (callback) {
    this.callback = callback;
}

export default Link;