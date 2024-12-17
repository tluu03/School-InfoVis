function filterMoviesByYear(movies, year) {
    // TODO: Filter the movies based on the selected year. Return an array of movies that were released after the selected year.
    const selectedYear = parseInt(year);
    const filteredMovies = movies.filter(movie => movie.releaseYear > selectedYear);
    
    return filteredMovies;
}

function mapMovies(movies) {
    // TODO: Map the movies to a new array of objects with only the title, genre, rating, and release year.
    const mappedMovies = movies.map(movie => {
        return {
            title: movie.title,
            genre: movie.genre,
            rating: movie.rating,
            releaseYear: movie.releaseYear
        };
    });
    return mappedMovies;  
}

function calculateAverageRatingByGenre(movies) {
    // TODO: Calculate the average rating for each genre. Return an array of objects with the genre and average rating for that genre.
    // Hint: Use the dictionary data structure
    const genreRatings = {};
    movies.forEach(movie => {
        const genres = movie.genre.split(', ');
        genres.forEach(genre => {
            if (genreRatings[genre]) {
                genreRatings[genre].totalRating += movie.rating;
                genreRatings[genre].count += 1;
            } else {
                genreRatings[genre] = {
                    totalRating: movie.rating,
                    count: 1
                };
            }
        });
    });

    const averageRatings = [];
    for (const genre in genreRatings) {
        const avgRating = genreRatings[genre].totalRating / genreRatings[genre].count;
        averageRatings.push({ genre: genre, averageRating: avgRating });
    }
    return averageRatings;
}

function joinTopMovieTitles(movies) {
    // TODO: Join the titles of the top 5 movies based on rating with a comma and space.
    const topMovies = movies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    return topMovies.map(movie => movie.title).join(', ');
}

function updateBars(yearSelection) {
    // TODO: Update the visualization based on the selected year. Call the functions you created and the updateVisualization() function in d3Setup.js.

    const mappedMovies = mapMovies(moviesList);

    let filteredMovies;
    if (yearSelection === "all") {
        // TODO: Add logic to handle the case where 'all' is selected
        filteredMovies = mappedMovies;
    } else {
        const year = parseInt(yearSelection);
        // TODO: Handle the case where an actual year is selected
        filteredMovies = filterMoviesByYear(mappedMovies, year);
    }

    const genreAverages = calculateAverageRatingByGenre(filteredMovies);
    
    // TODO: Use the updateVisualizaiton function to actually update the bar chart
    updateVisualization(genreAverages);
    let topMovieTitles;
    // TODO: Get topMovieTitles using the joinTopMovieTitles function
    topMovieTitles = joinTopMovieTitles(filteredMovies);
    setTopMovies(topMovieTitles);
}