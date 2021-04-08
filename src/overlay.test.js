import Overlay from "./overlay"

test("appends stylesheets", () => {
    document.body.innerHTML = `
        <html>
            <head></head>
        </html>
    `;
    
    let overlay = new Overlay("localhost");

    expect(document.body.innerHTML).not.toContain("a.gumroad-button");
});

test("shows iframe", () => {
    document.body.innerHTML = `
        <html>
            <head></head>
            <body></body>
        </html>
    `;
    
    let overlay = new Overlay("localhost");
    overlay.show("permalink");

    let iframe = document.getElementsByTagName("iframe")[0];

    expect(iframe.className).toEqual("gumroad-overlay-iframe");
    expect(iframe.src).toEqual("https://localhost/overlay_page?single_product_mode=true&all_permalinks=permalink");
});

test("removes iframe", () => {
    document.body.innerHTML = `
        <html>
            <head></head>
            <body></body>
        </html>
    `;
    
    let overlay = new Overlay("localhost");

    overlay.show("permalink");
    expect(document.getElementsByTagName("iframe").length).toEqual(1);

    overlay.close();
    expect(document.getElementsByTagName("iframe").length).toEqual(0);
});