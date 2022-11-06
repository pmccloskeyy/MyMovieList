// Movie Class: Represents a Movie
class Movie {
    constructor(title, genre, rating, id) {
        this.title = title;
        this.genre = genre;
        this.rating = rating;
        this.id = id;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayMovies() {
        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovieToList(movie));
    }

    static addMovieToList(movie) {
        const list = document.querySelector('#movie-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>
            <td>${movie.id}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteMovie(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Insering alert message directly to the DOM
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#genre').value = '';
        document.querySelector('#rating').value = '';
        document.querySelector('#id').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getMovies() {
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }

        return movies;
    }

    static addMovie(movie) {
        const movies = Store.getMovies();

        movies.push(movie);

        localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(id) {
        const movies = Store.getMovies();

        movies.forEach((movie, index) => {
            if (movie.id === id) {
                movies.splice(index, 1);
            }
        });

        localStorage.setItem('movies', JSON.stringify(movies));
    }
}

// Event: Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Event: Add a Movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const genre = document.querySelector('#genre').value;
    const rating = document.querySelector('#rating').value;
    const id = document.querySelector('#id').value;

    // Validate
    if (title === '' || genre === "" || rating === '' || id === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate movie
        const movie = new Movie(title, genre, rating, id);

        // Add Movie to UI
        UI.addMovieToList(movie);

        // Add movie to store
        Store.addMovie(movie);

        // Show success message
        UI.showAlert('Movie Added', 'success');

        // Clear fields
        UI.clearFields();
    }
})

// Event: Remove a Movie
document.querySelector('#movie-list').addEventListener('click', (e) => {
    // Remove movie from UI
    UI.deleteMovie(e.target)

    // Remove movie from store
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Movie removed', 'success');
})