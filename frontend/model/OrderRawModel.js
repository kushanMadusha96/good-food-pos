export class OrderRaw {
    constructor(customerId, orderId, date, itemId, itemName, price, qty) {
        this.customerId = customerId;
        this.orderId = orderId;
        this.date = date;
        this.itemId = itemId;
        this.itemName = itemName;
        this.price = price;
        this.qty = qty;
    }
}