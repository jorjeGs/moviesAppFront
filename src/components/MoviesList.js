import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class MoviesList extends Component {
    state = {
        movies: [],
        imdbid: "",
        _id: ""
    }
    componentDidMount() {
        this.getMovies()
    }
    async getMovies() {
        const res = await axios.get('https://moviesapp-api.onrender.com/api/movies')
        this.setState({ movies: res.data })
    }
    deleteMovie = async (id) => {
        await axios.delete('https://moviesapp-api.onrender.com/api/movies/' + id);
        this.getMovies();
    }
    onChangeimdbid = (e) => {
        console.log(e.target.value)
        this.setState({
            imdbid: e.target.value
        })
    }
    onSubmit = async e => {
        e.preventDefault(); //con esta funcion evitamos reiniciar el navegador
        await axios.post('https://moviesapp-api.onrender.com/api/movies', { //enviamos los datos al servidor
            imdbid: this.state.imdbid
        })
        this.setState({ imdbid: '' });
        console.log("acaando")
        this.getMovies();

    }
    render() {
        return (
            <div className="row">
                <h2 className="text-center">Todas las peliculas</h2>
                {
                    this.state.movies.map(movie => (
                        <div className="col-md-4 p-2" key={movie._id}>
                            <div className="card movie_card">
                                <Link to={/review/ + movie._id} >
                                    <div className='card-header d-flex justify-content-between'>
                                            <img src={movie.imgurl} className="card-img-top" alt="..." />
                                    </div>
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <div className='d-flex justify-content-between'>
                                        <span className="badge bg-dark">{movie.released}</span>
                                        <span className="badge bg-warning text-dark" ><i className="fas fa-star"></i>{movie.globalrating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='col-md-6 offset-md-3 p3'>
                    <h2 className="text-center">Agrega una pelicula</h2>
                    <div className="card card-body">
                        <h3>Ingresa el codigo de IMDB</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.imdbid}
                                    onChange={this.onChangeimdbid}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-1 justify-content-between">
                                Agregar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
