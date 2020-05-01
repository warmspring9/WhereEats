(function ScopeWrapper($) {
    $('#saveBtn').hide();
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
    $('#genBtn').click(function () {
        var data;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=100&currency=USD&distance=100&open_now=true&lunit=km&lang=en_US&latitude=9.934631&longitude=-84.078291",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "1f46c51fc1mshfc16f9194d41587p1e0fe9jsn8dd339bd2c62"
            }
        }
        $.ajax(settings).done(function (response) {
            var choice =  Math.trunc(Math.random() * response.data.length-1);
            while(response.data[choice].name=="" || response.data[choice].name==" " || response.data[choice].name==undefined){
                var choice =  Math.trunc(Math.random() * response.data.length-1); 
            }
            var chosen = response.data[choice];
            $('#title').empty();
            $('#title').append(chosen.name);
            $('#cuisine').empty();
            var categories ="";
            if(chosen.cuisine!==undefined){
                for(x of chosen.cuisine){
                    categories+=x.name+",";
                }
            }
            $('#cuisine').append(categories.substring(0,categories.length-1));
            $('#distance').empty();
            $('#distance').append(chosen.distance_string);
            $('#ratings').empty();
            if(chosen.rating!==undefined){
                $('#ratings').append(chosen.rating + " &starf;");
            }
            $('#pricing').empty();
            $('#pricing').append(chosen.price_level);
            $('#address').empty();
            $('#address').append(chosen.address);
            $('#address').append(document.createElement('br'));
            $('#address').append("Telephone: " + chosen.phone);
            $('#address').append(document.createElement('br'));
            $('#saveBtn').show();
            if(chosen.website!==undefined){
                $('#address').append("Visit us at: ");
                var website = document.createElement('a');
                website.innerHTML = chosen.website;
                website.setAttribute("href",chosen.website);
                $('#address').append(website);
            }
            $('#description').empty();
            $('#description').append(chosen.description);
         }).fail(function() {
            alert( "Error loading data" );
        });
    });

    $('#saveBtn').click(function () {
        var Name = $('#title').text();
        var Rating = $('#ratings').text();
        var Price = $('#pricing').text();
        var Address = $('address').text();
        if(Rating == ""){
            Rating = "no Rating";
        }
        if(!Price){
            Price = "not set";
        }
        if(Address == ""){
            Address="No Address set";
        }
        postRestaurant(Name,Rating,Price,Address);
    });

    function postRestaurant(Name,Rating,Price,Address) {
        $.ajax({
            method: 'POST',
            url: "https://cors-anywhere.herokuapp.com/" + _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Name: Name,
                Price: Price,
                Rating, Rating,
                Address: Address
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured while posting your restaurant:\n' + jqXHR.responseText); //cambiar a sweet alerts
            }
        });
    }
    function completeRequest(result) {
        
        console.log('Response received from API: ', result);
        $('#saveBtn').hide();
    }
}(jQuery));