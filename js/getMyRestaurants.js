(function ScopeWrapper($) {
    $('#noRest').hide();
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    var User;
    WildRydes.username.then(function setUsername(user){
        if(user){
            User = user;
        }else{
            console.log("no user");
        }
    }).catch(function ErrorHandler(error){
        alert(error);
        window.location.href = '/signin.html';
    });
    $('#seeBtn').click(function () {
        $.ajax({
            method: 'GET',
            url: "https://cors-anywhere.herokuapp.com/" + 'https://tk21ntl9qi.execute-api.us-east-2.amazonaws.com/prod' + '/ride/' + User,
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting response: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured while posting your restaurant:\n' + jqXHR.responseText); //cambiar a sweet alerts
            }
        });
    });
    

    function completeRequest(result) {
        var items = result.result.Items;
        if(items.length>0){
            $('#noRest').hide();
        }else{
            $('#mORest').show();
        }
        for (i = 0; i < items.length; i++) {
            appendItem(items[i]);
        }
    }
    function appendItem(item){
        /* console.log(item);
        var div = document.createElement("div");
        div.setAttribute("class", "item");
        var title = $( "<div class='item'><input type='button' class='btn' id="+item.RestaurantId+" onClick='reply_click(this.id)' value='delete'></div>" ); */
        var div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = "<h2>"+item.Name+"</h2><p>"+item.Rating+"</p><p>"+item.Price+"</p><address>"+item.Address+"</address>";
        var btn = document.createElement("button");
        btn.classList.add("btn");
        btn.id = item.RestaurantId;
        btn.innerText = "Delete";
        btn.addEventListener('click',function(){
            deleteItem(this.id,User);
        });
        div.appendChild(btn);
        $('#info').append(div);
        
    }
    function deleteItem(id,username){
        debugger
        $.ajax({
            method: 'DELETE',
            url: "https://cors-anywhere.herokuapp.com/" + 'https://tk21ntl9qi.execute-api.us-east-2.amazonaws.com/prod' + '/ride/' + username + '/' + id,
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: succesDelete,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.log("succesfuly deleted");
                location.reload();
            }
        });
        debugger
    }
    function succesDelete(){

        console.log("succesfuly deleted");
        location.reload();
    }

    
    
}(jQuery));