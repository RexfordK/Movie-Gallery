/*
MovieDB api key:
eb69af7187612c2c9f92c7b12e2611d5
*/

$(document).ready(function () {

    //set movie search to active
    // console.log($("#searchText").val());
    //create an event for when form is submited
    $("#searchForm").on("submit", function (event) {
        $(".description").addClass("js--no-display");
        let searchText = $("#searchText").val();
        console.log(searchText);
            getMoviesList(searchText);
       
        //stops form from submitting to a file
        event.preventDefault();
    });
});


/*
1. DISPLAY LIST OF MOVIES IN SEARCH SCREEN
*/
function getMoviesList(search) {
    let baseURL = "https://api.themoviedb.org/3/search/movie?api_key=eb69af7187612c2c9f92c7b12e2611d5&language=en-US&query=";
    // obtain api from MovieDB
    axios.get(baseURL + search).then(function (response) {
        if(response.data.total_results != 0){
        
        let movies = response.data.results;
        let imageStartURL = "https://image.tmdb.org/t/p/w200";
        let output = " ";

        for (let x = 0; x < movies.length; x++) {
            let movieImageUrl = movies[x].poster_path;
            if (movieImageUrl != null) {
                output += `
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="well text-center movie-con">
                        <img src="${imageStartURL + movieImageUrl}">  
                        <h5>${movies[x].title}</h5>
                        <a onclick='movieSelected("${movies[x].id}")' class="btn btn-primary buttons" href="#">Movie Details</a>
                        </div>
                    </div>
                `;
                $("#movieContainer").toggleClass("js--con-style");
                
            }
        };
        $("#movies").html(output);

        // console.log(response.data);
        // console.log(movies[0].id);
        // console.log("Length:" + response.data.results.length);
    } else {
        getInvalidPage();
    }


    }).catch(function (error) {
        console.log("error\n" + error);
    });
}

function getInvalidPage(){
    let output = ` 
            <div class=col-sm-12>
                <h2 class="center">Sorry there are no results. Please Try Again.</h2>
            </div>
    `
    console.log("returned");
    $("#movies").html(output);
}

/*
2. when user selects a movie:
gather data and send it to next html page for processing
*/
function movieSelected(movieId) {
    sessionStorage.setItem("movieId", movieId);
    let location = "http://rkdevelopment.org/movie/movie.html";
    window.location.href = location;
    return false;
}


/*
3.Loads the imformation page for selected movie:
on next html page
*/
function getMovie() {
    let movieDBSite = "https://www.themoviedb.org/movie/"
    let movieId = sessionStorage.getItem("movieId");
    // console.log(movieId);
    let baseURL = "https://api.themoviedb.org/3/movie/";
    let endingURL = "?api_key=eb69af7187612c2c9f92c7b12e2611d5&language=en-US";
    let endURLCredits = "/credits?api_key=eb69af7187612c2c9f92c7b12e2611d5";
    let castImageUrl = "https://image.tmdb.org/t/p/w300";
    // obtain api from MovieDB
    axios.get(baseURL + movieId + endingURL).then(function (response) {

        let data = response.data;
        console.log(data);

        //obtain other movie details
        let movieName = response.data.original_title;
        let movieImageUrl = "https://image.tmdb.org/t/p/w300" + data.poster_path;
        let output = " ";

        // obtain genre/movie detail
        var genreAPI = response.data.genres;
        var genreArrayList = getGenre(genreAPI);
        var genreList = genreArrayList.join(", ");

        //obtain money info
        var budget = numFormatter(data.budget);
        var revenue = numFormatter(data.revenue);

        // create html template
        output = `
            <div class="row">
                <div class="col-md-5">
                    <img src="${movieImageUrl}" class="thumbnail">
                </div>
                <div class="col-md-7 movie-info-con">
                    <div class="con">
                        <h2>${data.original_title}</h2>
                        <ul class="list-group">
                        <li class="list-group-item"><span class="bold">Rating :</span> ${data.vote_average}</li>
                            <li class="list-group-item"><span class="bold">Released: </span> ${data.release_date}</li>
                            <li class="list-group-item"><span class="bold">Genre: </span> ${genreList}</li>
                            <li class="list-group-item"><span class="bold">Budget: </span> ${budget}</li>
                            <li class="list-group-item"><span class="bold">Revenue: </span> ${revenue}</li>
                        </ul>
                    </div>
                    <div class="con btn-con">
                    <div class="btn-div">
                        <a href="${movieDBSite+data.id}"  class="btn btn-primary btn-style" target="_blank">Visit MovieDB</a>
                    </div>
                    <div class="btn-div">
                        <a href="index.html"  class="btn btn-danger btn-style">Go Back To Search</a>
                    </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="well" id="plot-container">
                    <h3>Plot</h3>
                    <p>${getPlot(data.overview)}</p>
                </div>
            </div>
            `;
        // output html template
        // console.log(getSelection());
        $("#movie").html(output);
    }).catch(function (error) {
        console.log("ERROR:" + error);
    })
}

/*
HELPER FUNCTIONS
*/
// function: to get list of genre from selected movie
function getGenre(genreArray) {
    var names = [];
    for (let x = 0; x < genreArray.length; x++) {
        // console.log("this is the genre" + genreArray[x].name);
        names.push(genreArray[x].name);
    }
    return names;
}

//number formatter
function numFormatter(num) {
    var moneyFormmater = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    });
    if (num) {
        return moneyFormmater.format(num);
    } else {
        return "Not Available";
    }
}

//return plot
function getPlot(plot) {
    if (plot) {
        return plot;
    } else {
        return "Not Available."
    }
}