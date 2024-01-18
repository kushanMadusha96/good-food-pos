export const saveItem = async (customer) => {
    try {
        const response = await fetch('http://localhost:8080/backend/item', {
            method: 'POST',
            body: JSON.stringify(customer),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllItem = async () => {
    try {
        const response = await fetch(`http://localhost:8080/backend/item?action=all`);
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error :' + error);
    }
}

export const nextItemId = async () => {
    try {
        const response = await fetch(`http://localhost:8080/backend/item?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}

export const updateItem = async (item) => {
    try {
        const response = await fetch('http://localhost:8080/backend/item', {
            method: 'PUT',
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}


export const deleteItem = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/backend/item?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}