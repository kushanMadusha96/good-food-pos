//search orders
// import {order_detail_db} from "../db/order_detail_db.js";
import {getAllOrders,deleteOrderDetail} from "../api/PlaceOrderApi.js";

$("document").ready(async function () {
    await loadAll();
});

$("#search-input").on("input", async function () {
    $("#od-table-body").empty();
    const orders = await getAllOrders();
    orders.map((item, index) => {
        if (item.date.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || item.customerId.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || item.orderId.toLowerCase().startsWith($("#search-input").val().toLowerCase())) {
            $("#od-table-body").append(`<tr><td>${item.date}</td><td>${item.customerId}</td><td class="orderId">${item.orderId}</td><td>${item.items}</td><td>${item.total}</td></tr>`);
        }
    })
});

//delete order detail
let order_id;
$("#od-crudButtons button").eq(0).on('click', async () => {
    const response = await deleteOrderDetail(order_id);
    await loadAll();
    if (200 == response) {
       await Swal.fire({
           position: 'center',
           icon: 'success',
           title: 'order delete successfully',
           showConfirmButton: false,
           timer: 1500
       });
   }else {
       await Swal.fire({
           position: 'center',
           icon: 'error',
           title: 'order not deleted, try again',
           showConfirmButton: false,
           timer: 1500
       });
   }
});

//get id from clicked raw
$("#od-table-body").on('click', ('tr'), function () {
    order_id = $(this).find(".orderId").text();
})

//load all details
async function loadAll() {
    $("#od-table-body").empty();
    const orders = await getAllOrders();
    orders.map((item, index) => {
        $("#od-table-body").append(`<tr><td>${item.date}</td><td>${item.customerId}</td><td class="orderId">${item.orderId}</td><td>${item.items}</td><td>${item.total}</td></tr>`);
    });
}