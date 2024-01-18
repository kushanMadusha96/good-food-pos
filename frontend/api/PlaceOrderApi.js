export const saveOrderDetail = async (order) => {
    try {
        const response = await fetch('http://localhost:8080/backend/orderDetail', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllOrders = async () => {
    try {
        const response = await fetch(`http://localhost:8080/backend/orderDetail?action=all`);
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error :' + error);
    }
}

export const getCurrentQty = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/backend/item?action=${id}`);
        const currentQty = await response.text();
        console.log(currentQty)
        return currentQty;
    } catch (error) {
        console.error('Error :' + error);
    }
}

export const nextOrderId = async () => {
    try {
        const response = await fetch(`http://localhost:8080/backend/orderDetail?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}

export const deleteOrderDetail = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/backend/orderDetail?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}

export const reduceItemCount = async (itemQtyObjArray) => {
    try {
        const response = await fetch(`http://localhost:8080/backend/item?reduce=reduce`, {
            method: 'PUT',
            body: JSON.stringify(itemQtyObjArray),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}

