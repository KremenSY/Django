//The getElementsByClassName returns a live collection. the length property of the object is 0 because at that point of time there is no element with that className in the DOM. Since the console shows the live representation of an object, it shows all the matching elements when the elements are added to the DOM.
//DOM parser parses the documents from top to bottom, when it reaches to a tag, it parses it and adds the DOM representation of it (an instance of HTMLElement interface) to the Document Object Model. Either move the script tag to the end of body tag or listen to DOMContentLoaded event which is fired when the initial HTML document has been completely loaded and parsed.
//in browser for script debug: devtools->network->disable cash
var updateBtns = document.getElementsByClassName('update-cart');
for (i = 0; i < updateBtns.length; i++) {
	updateBtns[i].addEventListener('click', function(){
		var productId = this.dataset.product;
		var action = this.dataset.action;
		// console.log(this.dataset);
		// console.log('productId:', productId, 'action:', action);
		// console.log('USER:', user);
		if (user == 'AnonymousUser'){
			// console.log('User is not authenticated');
			addCookieItem(productId, action)
		}else{
			updateUserOrder(productId, action);
		}
	})
}

function addCookieItem(productId, action){
	// console.log('User is not authenticated')

	if (action=='add'){
		if (cart[productId]==undefined){
			cart[productId]={'quantity':1}
		}else{
			cart[productId]['quantity']+=1
		}
	}

	if (action=='remove'){
		cart[productId]['quantity']-=1
		if (cart[productId]['quantity']<=0){
			// console.log('Item should be deleted')
			delete cart[productId];
		}
	}
	// console.log('cart:'. cart)
	document.cookie='cart='+JSON.stringify(cart)+";domain=;path=/"
	location.reload()
}

function updateUserOrder(productId, action){
	// console.log('User is logged in, sending data...');
	var url='/update_item/';
	// console.log('URL:', url);
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
			'X-CSRFToken':csrfToken
		},
		body:JSON.stringify({'productId':productId, 'action':action})
	})
	.then((response) => {
	return response.json();
	})
	.then((data) => {
		location.reload()
		// console.log('data:',data)
	})
	.catch((error) => console.error(error))
}