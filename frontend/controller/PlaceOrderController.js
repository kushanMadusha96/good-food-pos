import {OrderRaw} from "../model/OrderRawModel.js";
import {nextOrderId, getAllOrders, saveOrderDetail, getCurrentQty,reduceItemCount} from "../api/PlaceOrderApi.js";
import {getAllCustomers} from "../api/CustomerApi.js";
import {getAllItem} from "../api/ItemApi.js";
import {OrderDetail} from "../model/OrderDetailModel.js";
import {ItemQty} from "../model/ItemQtyModel.js";
const order_raw_db = [];

//regex patterns
const quantityPattern = /^\d+$/;

// check_table();
setInterval(check_table, 1000);

//disable update raw on page load
$("#update-raw").prop("disabled", true);

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//realtime date date input
$(document).ready(async function () {
    await generateNextOrderId();

    function updateDateTime() {
        var now = new Date();
        var dateTimeString = now.toLocaleString();
        $("#date").val(dateTimeString);
        $("#po-customer-id").prop("readonly", true);
        $("#order-id").prop("readonly", true);
        $("#date").prop("readonly", true);
        $("#po-item-id").prop("readonly", true);
        $("#po-item-name").prop("readonly", true);
        $("#po-price").prop("readonly", true);
        $("#qty-on-hand").prop("readonly", true);
        $("#p-total").prop("readonly", true);
        $("#balance").prop("readonly", true);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// load all orders to table => ( place order )
function loadAll() {
    let total = 0.0;
    $("#po-table-body").empty();
    order_raw_db.map((item, index) => {
        $("#po-table-body").append(`<tr><td class="customer-id">${item.customerId}</td><td class="order-id">${item.orderId}</td><td class="date">${item.date}</td><td class="item-id">${item.itemId}</td><td class="item-name">${item.itemName}</td><td class="price">${item.price}</td><td class="qty">${item.qty}</td></tr>`);
        $("#total-lbl").text(total = parseFloat(total) + (parseFloat(item.price) * parseFloat(item.qty)));
    });
};

// clear inputs
function clearInputs() {
    $("#po-item-id").val(""),
        $("#po-item-name").val(""),
        $("#po-price").val(""),
        $("#qty-on-hand").val(""),
        $("#po-qty").val("")
}

//check buying qty is have in stock
function checkBuyingQty() {
    let on_hand_qty = parseInt($("#qty-on-hand").val());
    let buying_qty = parseInt($("#po-qty").val());

    if (isNaN(on_hand_qty) || isNaN(buying_qty)) {
        return false;
    }

    if (buying_qty < 1) {
        return false;
    }

    if (buying_qty > on_hand_qty) {
        return false;
    }
    return true;
}

//change color in qty input for wrong values
$("#po-qty").on('input', function () {
    let on_hand_qty = parseInt($("#qty-on-hand").val());
    let buying_qty = parseInt($("#po-qty").val());

    if (buying_qty < 1 || buying_qty > on_hand_qty) {
        $("#po-qty").css("border", "1px solid red");
    } else {
        $("#po-qty").css("border", "none");
    }
});

//add new order raw
let buying_item_id;
let buying_qty;

$("#add-row").on('click', async () => {
    if (!$("#po-customer-id").val() || !$("#order-id").val() || !$("#date").val() || !$("#po-item-id").val() || !$("#po-item-name").val() || !$("#po-price").val() || !$("#po-qty").val()) {
        showError("Fill input correctly!");
        return;
    }

    if (!quantityPattern.test($("#po-qty").val())) {
        showError("Invalid quantity! Enter only whole numbers...");
        return;
    }

    if (!checkBuyingQty()) {
        $("#po-qty").css("border", "2px solid red");
        showError("not valid qty..");
        return;
    }

    let isBuying = isAlreadyBuying($("#po-item-name").val(), $("#po-qty").val());
    if (!isBuying) {
        order_raw_db.push(new OrderRaw(
            $("#po-customer-id").val(),
            $("#order-id").val(),
            $("#date").val(),
            $("#po-item-id").val(),
            $("#po-item-name").val(),
            $("#po-price").val(),
            $("#po-qty").val()
        ));
    }
    buying_item_id = $("#po-item-id").val();
    buying_qty = $("#po-qty").val();

    await loadAll();
    await clearInputs()
});

//add item for all ready buying item
function isAlreadyBuying(item_name, new_qty) {
    for (let i = 0; i < order_raw_db.length; i++) {
        if (order_raw_db[i].itemName === item_name) {
            order_raw_db[i].qty = parseInt(order_raw_db[i].qty) + (parseInt(new_qty));
            return true;
        }
    }
    return false;
}

//click raw to inputs
let item_id;
let qty;
let total;
$("#po-table-body").on("click", ("tr"), async function () {
    $("#add-row").prop("disabled", true);
    $("#po-customer-id").val($(this).find(".customer-id").text());
    $("#order-id").val($(this).find(".order-id").text());
    $("#date").val($(this).find(".date").text());
    $("#po-item-id").val($(this).find(".item-id").text());
    $("#po-item-name").val($(this).find(".item-name").text());
    $("#po-price").val($(this).find(".price").text());
    $("#po-qty").val($(this).find(".qty").text());
    item_id = $(this).find(".item-id").text();
    qty = $(this).find(".qty").text();
    total = $("#total-lbl").text();
    $("#qty-on-hand").val(await calculateOnHandQty(item_id));
    $("#update-raw").prop("disabled", false);
});

async function calculateOnHandQty(id) {
    const currentQty = await getCurrentQty(id);
    return currentQty;
}

// update raw data
$("#update-raw").on('click', async () => {
    if (!$("#po-customer-id").val() || !$("#order-id").val() || !$("#date").val() || !$("#po-item-id").val() || !$("#po-item-name").val() || !$("#po-price").val() || !$("#po-qty").val()) {
        showError("Fill input correctly!");
        return;
    }

    if (!quantityPattern.test($("#po-qty").val())) {
        showError("Invalid quantity! Enter only whole numbers...");
        return;
    }

    if (!checkBuyingQty()) {
        $("#po-qty").css("border", "2px solid red");
        showError("not valid qty..");
        return;
    }

    if (!quantityPattern.test($("#po-qty").val())) {
        showError("Invalid quantity, Enter only whole numbers");
        return;
    }

    order_raw_db[order_raw_db.findIndex(item => item.itemId === item_id)] = new OrderRaw(
        $("#po-customer-id").val(),
        $("#order-id").val(),
        $("#date").val(),
        $("#po-item-id").val(),
        $("#po-item-name").val(),
        $("#po-price").val(),
        $("#po-qty").val()
    );
    await loadAll();

    await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'raw updated successfully',
        showConfirmButton: false,
        timer: 1500
    });
    // await reduce_item_count_when_updateRaw( $("#po-item-id").val(), newQty);
    await clearInputs();
});


//remove item raw
$("#remove-row").on('click', async () => {
    order_raw_db.splice(order_raw_db.findIndex(item => item.itemId === item_id), 1);
    const items = await getAllItem();
    let index = items.findIndex(item => item.itemId === item_id);
    items[index].qty = parseInt(items[index].qty) + parseInt(qty);
    $("#total-lbl").text(parseFloat($("#total-lbl").text()) - (parseFloat(items[index].price) * parseInt(buying_qty)));
    await loadAll()
    clearInputs();
});

// order details for table (save order details)
const items = [];

$("#place-order").on('click', async () => {
    if (parseFloat($("#p-total").val()) > parseFloat($("#cash").val())) {
        showError("not enough money for order...");
        return;
    }
    if (!$("#balance").val()) {
        showError("please show balance before purchase...");
        return;
    }
    $("#po-table-body tr").each(function () {
        items.push($(this).find(".item-name").text());
    });

    const saveStatus = await saveOrderDetail(new OrderDetail($("#date").val(), $("#po-customer-id").val(), $("#order-id").val(), items.join(","), $("#p-total").val()));
    const reduceStatus = await reduceItemQty();
    if (saveStatus == 200 && reduceStatus == 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'place order successfully',
            showConfirmButton: false,
            timer: 1500
        });
        $("#add-row").prop("disabled", false);
    }
    await load_all_order_details();
    await $("#po-table-body").empty();
    items.length = 0;
    order_raw_db.length = 0;
    await generateNextOrderId();
    clear_inputs_after_order();
});

//clear inputs after place order
function clear_inputs_after_order() {
    clearInputs()
    $("#po-customer-id").val("");
    $("#total-lbl").text("");
    $("#p-total").val("");
    $("#discount").val("");
    $("#cash").val("");
    $("#balance").val("");
}

//load all order details
async function load_all_order_details() {
    $("#od-table-body").empty();
    const orders = await getAllOrders();
    orders.map((item, index) => {
        $("#od-table-body").append(`<tr><td>${item.date}</td><td>${item.customerId}</td><td class="orderId">${item.orderId}</td><td>${item.items}</td><td>${item.total}</td></tr>`);
    });
}

// select value to dropbox (customer or item)
let selectedValue;
$(document).ready(function () {
    $('#dropdown-menu li').click(async function () {
        selectedValue = $(this).text();
        $("#dropdown-btn").text(selectedValue);

        $('#search-input').val('');
        $("#values").empty();

        if (selectedValue === "by customer") {
            const customers = await getAllCustomers();
            customers.map((item, index) => {
                $("#values").append(`<option value="${item.nic}"></option>`)
            })
        } else {
            const items = await getAllItem();
            $("#search-dropbox").text("items");
            items.map((item, index) => {
                $("#values").append(`<option value="${item.itemName}"></option>`)
            })
        }
    });
});

//search value to fields
$("#search-input").on("keypress", async function (e) {
    let key = e.which;
    if (key == 13) {
        $("#update-raw").prop("disabled", true);
        if (selectedValue === "by customer") {
            if ($("#po-table-body tr").length === 0) {
                clearInputs();
                const customers = await getAllCustomers();
                let cus_index = customers.findIndex((item) => item.nic === $("#search-input").val());
                if (cus_index != null) {
                    $("#po-customer-id").val(customers[cus_index].customerId);
                } else {
                    showError("no found customer...");
                }
            } else {
                showError("please finish current order before make new order");
                return;
            }
        } else {
            if (selectedValue === "by item") {
                clearInputs();
                $("#add-row").prop("disabled", false);
                const items = await getAllItem();
                let selected_item_index = items.findIndex((item) => item.itemName === $("#search-input").val());
                if (selected_item_index != null) {
                    let qty = searchAlreadyBuyingQty(items[selected_item_index].itemName);
                    if (qty != -1) {
                        $("#po-item-id").val(items[selected_item_index].itemId);
                        $("#po-item-name").val(items[selected_item_index].itemName);
                        $("#po-price").val(items[selected_item_index].price);
                        $("#qty-on-hand").val(items[selected_item_index].qty);
                        $("#po-qty").val(qty);
                        $("#add-row").prop("disabled", true);
                        $("#update-raw").prop("disabled", false);
                    } else {
                        $("#po-item-id").val(items[selected_item_index].itemId);
                        $("#po-item-name").val(items[selected_item_index].itemName);
                        $("#po-price").val(items[selected_item_index].price);
                        $("#qty-on-hand").val(items[selected_item_index].qty);
                        $("#add-row").prop("disabled", false);
                        $("#update-raw").prop("disabled", true);
                    }
                }
            } else {
                showError("no found item...");
            }
        }
    }
});


//search all ready buying item qty
function searchAlreadyBuyingQty(item_name) {
    for (let i = 0; i < order_raw_db.length; i++) {
        if (order_raw_db[i].itemName === item_name) {
            return order_raw_db[i].qty;
        }
    }
    return -1;
}

//generate next order-id
async function generateNextOrderId() {
    $("#order-id").val(await nextOrderId());
}

//check if table is none
function check_table() {
    if ($("#po-table-body tr").length === 0) {
        $("#purchase-order-btn").prop("disabled", true);
    } else {
        $("#purchase-order-btn").prop("disabled", false);
    }
}

//total set to total in purchase model
$("#purchase-order-btn").on('click', () => {
    $("#p-total").val($("#total-lbl").text());
});

//calculate total & balance after discount
$("#discount").on("keypress", async function (e) {
    let key = e.which;
    if (key == 13) {
        await $("#p-total").val($("#p-total").val() - ($("#p-total").val() / 100) * $("#discount").val());
        await $("#balance").val($("#cash").val() - $("#p-total").val());
    }
});

//calculate balance
$("#cash").on("keypress", async function (e) {
    let key = e.which;
    if (key == 13) {
        await $("#balance").val($("#cash").val() - $("#p-total").val());
    }
});

//check cash value is legal
$("#cash").on('input', function () {
    if (parseFloat($("#p-total").val()) > parseFloat($("#cash").val())) {
        $("#cash").css("border", "2px solid red");
    } else {
        $("#cash").css("border", "none");
    }
})

const itemQtyDB = [];

//reduce item count when place order
async function reduceItemQty() {
    order_raw_db.map((item) => {
        itemQtyDB.push(new ItemQty(item.itemId, item.qty));
    });
    await reduceItemCount(itemQtyDB);
    itemQtyDB.length = 0;
}