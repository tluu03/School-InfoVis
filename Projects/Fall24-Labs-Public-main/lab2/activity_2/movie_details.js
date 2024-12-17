// **** Your JavaScript code goes here ****

// Copy and paste your data structure from the previous activity
const movieList = [
    {
        title: "The Secret Life of Walter Mitty",
        director: "Ben Stiller",
        releaseYear: 2013,
        genre: "Adventure, Comedy, Drama",
        rating: 9.0/10.0,
        boxOffice: 188.3
    },
    {
        title: "Everything Everywhere All at Once",
        director: "Daniel Kwan, Daniel Scheinert",
        releaseYear: 2022,
        genre: "Action, Adventure, Sci-Fi",
        rating: 10.0/10.0,
        boxOffice: 140.0
    },
    {
        title: "Monkey Man",
        director: "Dev Patel",
        releaseYear: 2023,
        genre: "Action, Thriller",
        rating: 8.0/10.0,
        boxOffice: 50.0
    }
];

function adjustRating(movie, adjustment) {
    // TODO: Return the new rating for movie adjusted by adjustment
    let newRating = movie.rating + adjustment;
    if (newRating > 10) {
        newRating = 10;
    } else if (newRating < 0) {
        newRating = 0;
    }
    return newRating;
}
movieList.forEach(movie => {
    if (movie.title !== "Everything Everywhere All at Once") {
        movie.rating = adjustRating(movie, 1.5);
    }
});

function debugMovies(movies) {
    // TODO: Loop through the movies list and log their title and new rating
    movies.forEach(movie => {
        console.log(`Title: ${movie.title}, New Rating: ${movie.rating}`);
    });
}
debugMovies(movieList);


function calculateAverageRating(movies) {
    // TODO: Calculate average rating of movies
    let totalRating = 0;
    movies.forEach(movie => {
        totalRating += movie.rating;
    });
    return totalRating / movies.length;
}
console.log(`Average Rating: ${calculateAverageRating(movieList)}`);

function findHighestGrossing(movies) {
    // TODO: Find highest grossing movie's title
    let highestGrossingMovie = movies[0];
    movies.forEach(movie => {
        if (movie.boxOffice > highestGrossingMovie.boxOffice) {
            highestGrossingMovie = movie;
        }
    });
    return highestGrossingMovie.title;
}
console.log(`Highest Grossing Movie: ${findHighestGrossing(movieList)}`);


// Changing the DOM with JavaScript

// Starter Code
var main = document.getElementById("main");
var header = document.createElement("h1");
main.appendChild(header);
header.textContent = "Movies Information";
var div1 = document.createElement("div");
div1.setAttribute("id", "movie-container");
main.appendChild(div1);

function displayMovieCount(movies) {
    // TODO: Display movie count as specified in the readMe
    const movieCount = document.createElement("h2");
    movieCount.textContent = `Total Movies: ${movies.length}`;
    document.getElementById("movie-container").appendChild(movieCount);
}

function createMovieCards(movies) {
    // TODO: Create movie card for each movie in movies
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        
        const title = document.createElement("h3");
        title.textContent = movie.title;
        movieCard.appendChild(title);

        const director = document.createElement("p");
        director.textContent = `Director: ${movie.director}`;
        movieCard.appendChild(director);

        const releaseYear = document.createElement("p");
        releaseYear.textContent = `Release Year: ${movie.releaseYear}`;
        movieCard.appendChild(releaseYear);

        const genre = document.createElement("p");
        genre.textContent = `Genre: ${movie.genre}`;
        movieCard.appendChild(genre);

        const rating = document.createElement("p");
        rating.textContent = `Rating: ${movie.rating}`;
        movieCard.appendChild(rating);

        const boxOffice = document.createElement("p");
        boxOffice.textContent = `Box Office: $${movie.boxOffice} million`;
        movieCard.appendChild(boxOffice);

        document.getElementById("movie-container").appendChild(movieCard);
    });
}

// Extra Credit
function highlightHighlyRated(minRating) {
    // TODO: highlight highly rated movie cards
}

// Main function
function initializeMoviePage(movies) {
    // TODO: Call the above functions in the correct order to set up your movie page
        displayMovieCount(movies);
        createMovieCards(movies);
    }
initializeMoviePage(movieList);
