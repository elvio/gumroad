import Link from "./link"

test("binds the correct links", () => {
    document.body.innerHTML = `
        <a id="product-1" href="https://gumroad.com/l/permalink1">Product 1</a>
        <a id="product-2" href="https://gum.co/permalink2">Product 2</a>
        <a id="product-3" href="https://silkroad.com/permalink3">Product 3</a>
    `;
    
    let link = new Link(["gumroad.com", "gum.co"]);
    var permalinks = [];

    link.clicked((permalink) => {
        permalinks.push(permalink);
    });

    document.getElementById("product-1").click();
    document.getElementById("product-2").click();
    document.getElementById("product-3").click();

    expect(permalinks).toContain("permalink1");
    expect(permalinks).toContain("permalink2");
    expect(permalinks).not.toContain("permalink3");

});

test("correctly parses permalinks", () => {
    document.body.innerHTML =
        '<a id="product-1" href="https://gumroad.com/l/permalink1?param=1">Product 1</a>' +
        '<a id="product-2" href="https://gum.co/permalink2?param=1&utm_source=2">Product 2</a>';    

    let link = new Link(["gumroad.com", "gum.co"]);
    var permalinks = [];

    link.clicked((permalink) => {
        permalinks.push(permalink);
    });

    document.getElementById("product-1").click();
    document.getElementById("product-2").click();
 
    expect(permalinks).toContain("permalink1");
    expect(permalinks).toContain("permalink2"); 
});

test("works with anchors", () => {
    document.body.innerHTML =
        '<a id="product-1" href="https://gumroad.com/l/permalink1?param=1">Product 1</a>' +
        '<a id="product-2" name="anchor">Product 2</a>';    

    let link = new Link(["gumroad.com", "gum.co"]);
    var permalinks = [];

    link.clicked((permalink) => {
        permalinks.push(permalink);
    });

    document.getElementById("product-1").click();
    document.getElementById("product-2").click();
 
    expect(permalinks).toHaveLength(1);
});