async function removeProduct(obj) {
    const elements = obj.parentNode.querySelectorAll("input[type='hidden']");
    const csrf = elements[0].value;
    const productID = elements[1].value;

    const result = await fetch(`/admin/delete-product/${productID}`, {
        method: "DELETE",
        headers: {
            "csrf-token": csrf
        }
    });
    const actResult = await result.json();
    if (actResult.message === "success") {
        obj.parentElement.parentElement.remove(obj.parentElement);
    }

}

