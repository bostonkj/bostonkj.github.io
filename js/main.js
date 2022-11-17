if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    // Initializing document with Event listeners and stuff
    var removeCartItemButtons = document.getElementsByClassName("btn-danger");
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName("shop-item-button");
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener("click", addToCartClicked);
    }

    document
        .getElementsByClassName("btn-purchase")[0]
        .addEventListener("click", purchaseClicked);
}

// This function runs to process the purchase
// The function "dlvPushPurchase" handles the datalayer and tag firing
function purchaseClicked() {
    alert("Thank you for your purchase");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

// This function runs to process the "add to cart" event
// The function "dlvPushAddToCart" handles the datalayer info and tag firing
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
    var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
    var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;

    /*
     * pushing to datalayer the purchase information
     * pushing to the datalayer outside the HTML doesn't work super well
     * INTERESTING: Pushing outside the HTML initializes a second datalayer which isn't recognized by GTM
     * window.datalayer = window.datalayer || [];
     * window.datalayer.push = {
     *     bookTitle: title,
     *     bookPrice: price,
     *     event: "add_to_cart",
     * };
     * Actual relic comment ^
     */

    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

// If duplicate items are added to cart, this will increment instead of throwing an alert
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");

    // Grabbing the cart from the page
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];

    // Grabbing the array of Cart Items from the cart container
    var cartItems = cartItemContainer.getElementsByClassName("cart-row");

    // Grabbing the names so the for loop is neater
    var cartItemNames =
        cartItemContainer.getElementsByClassName("cart-item-title");

    // Looping through the items to see if we're adding an item again
    for (var i = 0; i < cartItemNames.length; i++) {
        // If we're adding a duplicate, this will run
        if (cartItemNames[i].innerText == title) {
            // grabbing the specific item from the cart
            var inCart = cartItems[i].getElementsByClassName(
                "cart-quantity-input"
            );

            // Incrementing the value in the cart by 1 (bc one click = 1 add)
            inCart[0].valueAsNumber += 1;
            return;
        }
    }

    // Creating the cart row object for new items
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;

    // Adding cart row object to the page
    cartRow.innerHTML = cartRowContents;
    cartItemContainer.append(cartRow);

    // Event listeners so cart buttons will function
    cartRow
        .getElementsByClassName("btn-danger")[0]
        .addEventListener("click", removeCartItem);
    cartRow
        .getElementsByClassName("cart-quantity-input")[0]
        .addEventListener("change", quantityChanged);
}

// Updates the total shown at the bottom right
function updateCartTotal() {
    // Grab cart container
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    // Grab items from cart container
    var cartItems = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    // Loop over the items in the cart
    for (var i = 0; i < cartItems.length; i++) {
        // Object for the row we're iterating on
        var cartRow = cartItems[i];
        // HTML objects:
        // priceElement - price of the item
        // quantityElement - quantity in cart
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var quantityElement = cartRow.getElementsByClassName(
            "cart-quantity-input"
        )[0];

        // Change HTML objects to usable data
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    // Update price shown at bottom right
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("cart-total-price")[0].innerText =
        "$" + total;
}

function getCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    // Grab items from cart container
    var cartItems = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    // Loop over the items in the cart
    for (var i = 0; i < cartItems.length; i++) {
        // Object for the row we're iterating on
        var cartRow = cartItems[i];
        // HTML objects:
        // priceElement - price of the item
        // quantityElement - quantity in cart
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var quantityElement = cartRow.getElementsByClassName(
            "cart-quantity-input"
        )[0];

        // Change HTML objects to usable data
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }

    return total;
}

function getCartItems() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    // Grab items from cart container
    var cartItems = cartItemContainer.getElementsByClassName("cart-row");
    var cart = [];
    // Loop over the items in the cart
    for (var i = 0; i < cartItems.length; i++) {
        // Object for the row we're iterating on
        var cartRow = cartItems[i];
        // HTML objects:
        // priceElement - price of the item
        // quantityElement - quantity in cart
        // nameElement - name of item
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var nameElement = cartRow.getElementsByClassName("cart-item-title");
        var quantityElement = cartRow.getElementsByClassName(
            "cart-quantity-input"
        )[0];

        // Change HTML objects to usable data
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;

        cart.push({ name: nameElement, price: price, quantity: quantity });
    }

    return cart;
}
