class FormToggler {
    constructor() {
        this.toggler = document.querySelector(".form-toggler")
        this.formContainer = document.querySelector(".form-container")
        this.toggleMenu()
    }

    toggleMenu() {
        this.toggler.addEventListener('click', () => {
            this.formContainer.classList.toggle("display-form")
            this.toggler.classList.toggle("transform-x")
        })
    }
}

class MovieApp {
    constructor() {
        this.movieForm = document.querySelector('.movie-form')
        this.container = document.querySelector('.form-container')
        this.movieLists = document.querySelector('.movies-container')
        this.name = document.querySelector('.movie-name')
        this.poster = document.querySelector('#file')
        this.posterPrev = document.querySelector('.img-prev')
        this.starring = document.querySelector('.starring')
        this.date = document.querySelector('#date')
        this.info = document.querySelector('#info')
        this.filterInput = document.querySelector('.finput')
        this.showImage()
        this.addMovieToList()
        this.loadDataFromLS()
        this.deleteMovie()
        this.filterSearch()
    }

    // Show image in the form
    showImage() {
        this.poster.addEventListener('change', () => {
            const thisPoster = this
            const reader = new FileReader()
            reader.addEventListener('load', function () {
                thisPoster.posterPrev.setAttribute('src', this.result)
            })
            reader.readAsDataURL(thisPoster.poster.files[0])
        })
    }

    // Add Movie to list
    addMovieToList() {
        this.movieForm.addEventListener('submit', (e) => {
            const movieData = {
                imgPrev: this.posterPrev.src,
                name: this.name.value,
                starring: this.starring.value,
                date: this.date.value,
                info: this.info.value
            }

            if (movieData.name === '' || movieData.starring === '' || movieData.date === '' || movieData.info === '') {
                this.showAlert('Please fill in all fields', 'error')
            } else {
                this.addMovieToUI(movieData)
                this.addMovieToLS(movieData)
                this.clearFields()
                this.showAlert('New Movie Added', 'success')
            }
            e.preventDefault()
        })
    }

    // Show the Alert (if form field empty or filled up)
    showAlert(messege, className) {
        const div = document.createElement('div')
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(messege))
        this.container.insertBefore(div, this.movieForm)

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2000);
    }

    // Add Movie to UI
    addMovieToUI(data) {
        this.movieLists.insertAdjacentHTML('afterbegin', `
            <div class="movies">
                <img src="${data.imgPrev}" class="movies__poster">
                <div class="movies__body">
                    <div class="movies__name">
                        <p>${data.name}</p>
                    </div>
                    <div class="movies__relasedate">
                        <p>Release Date: ${data.date}</p>
                    </div>
                    <div class="movies__story">
                        <p>${data.info}</p>
                    </div>
                    <div class="movies__starring">
                        <span>Starring: ${data.starring}</span>
                    </div>
                    <a href="#" class="btn-w">Watch Movies</a>
                    <span><i class="close">&times;</i></span>
                </div>
            </div>
        `)
    }

    // Clear Form Fields
    clearFields() {
        this.posterPrev.setAttribute('src', '')
        this.name.value = ''
        this.starring.value = ''
        this.date.value = ''
        this.info.value = ''
    }

    // Get movie data from LocalStorage
    getMovieFromLS() {
        let movies
        if (localStorage.getItem('movies') === null) {
            movies = []
        } else {
            movies = JSON.parse(localStorage.getItem('movies'))
        }
        return movies
    }

    // Add Movie Data to LocalStorage
    addMovieToLS(data) {
        const movies = this.getMovieFromLS()
        movies.push(data)
        localStorage.setItem('movies', JSON.stringify(movies))
    }

    // Load Data from LocalStorage
    loadDataFromLS() {
        document.addEventListener('DOMContentLoaded', this.displayMovieFromLS.bind(this))
    }

    // Display Movie to UI From LocalStorage
    displayMovieFromLS() {
        const movies = this.getMovieFromLS()
        movies.forEach(movie => {
            this.addMovieToUI(movie)
        })
    }

    // Delete Movie
    deleteMovie() {
        this.movieLists.addEventListener('click', (e) => {
            this.deleteMovieFromUI(e.target)

            let targetContent = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[0].textContent
            this.removeMovieFromLS(targetContent)
        })
    }

    // Delete Movie From UI
    deleteMovieFromUI(target) {
        if (target.classList.contains('close')) {
            target.parentElement.parentElement.parentElement.remove()
        }
    }

    // Remove Movie From LocalStorage
    removeMovieFromLS(target) {
        const movies = this.getMovieFromLS()
        movies.forEach((movie, index) => {
            if (movie.name === target) {
                movies.splice(index, 1)
            }
        })
        localStorage.setItem('movies', JSON.stringify(movies))
    }

    // Filter Search Result
    filterSearch() {
        this.filterInput.addEventListener('keyup', () => {
            const inputValue = this.filterInput.value.toUpperCase()
            const movieCollections = this.movieLists.querySelectorAll('.movies')

            for (let i = 0; i < movieCollections.length; i++) {
                let matchesText = movieCollections[i].children[1].children[0]

                if (matchesText.textContent.toUpperCase().indexOf(inputValue) > -1) {
                    movieCollections[i].style.display = ''
                } else {
                    movieCollections[i].style.display = 'none'
                }
            }
        })
    }

}

const formToggler = new FormToggler()
const movieApp = new MovieApp()