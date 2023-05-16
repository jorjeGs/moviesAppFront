import React, { Component } from 'react'
import axios from 'axios'

export default class MovieReview extends Component {
  state = {
    users: [],
    title: '',
    released: '',
    category: '',
    imdbid: '',
    votes: '',
    synopsis: '',
    globalrating: '',
    localrating: '',
    ratings: [],
    imgurl: '',
    _id: '',
    selectedVote: 1,
    selectedUser: ''
  } //pendiente backend globalrating y ratings, agregar resultados de las apis

  async componentDidMount() {
    const pathArray = window.location.pathname.split('/', 3)//se obtiene id
    console.log(pathArray[2])
    const resusers = await axios.get('https://moviesapp-api.onrender.com/api/users');
    this.setState({ users: resusers.data, selectedUser: resusers.data[0].username });
    const res = await axios.get('https://moviesapp-api.onrender.com/api/movies/' + pathArray[2]); //
    this.setState({
      title: res.data.title,
      released: res.data.released,
      category: res.data.category,
      imdbid: res.data.imdbid,
      votes: res.data.votes,
      synopsis: res.data.synopsis,
      localrating: res.data.globalrating,
      imgurl: res.data.imgurl,
      _id: pathArray[2]
    })
    this.getRates()
    console.log(this.state.selectedUser)
    console.log(this.state.selectedVote)
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      star: this.state.selectedVote,
      username: this.state.selectedUser
    }
    await axios.put('https://moviesapp-api.onrender.com/api/movies/' + this.state._id, newReview);
    this.setState({
      selectedVote: 1,
      selectedUser: this.state.users[0].username
    })
    window.location.href = '/'; //redirecciona al inicio
  }
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state.selectedVote)
    console.log(this.state.selectedUser)
  }
  scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
  }
  async getRates(){
    const rates = []
    //obtencion de resultados
    try{
      const res1 = await axios.get('https://carlo-backend-pelis.onrender.com/api/movies/' + this.state.imdbid); //rating int carlo SCALE
      const res2 = await axios.get('https://distributed-systems-movies.sanchezcarlosjr.repl.co/movies/' + this.state.imdbid ); //local_rating carlos
      const res3 = await axios.get('https://movies-backend-1nuf.onrender.com/api/movies/' + this.state.imdbid);  //rate int frank
      const res4 = await axios.get('https://practica8sdbackend.onrender.com/api/films/' + this.state.imdbid); //ratingAverage.$numberDecimal String? SCALE
      //const res5 = await axios.get('https://movies-backend-angel-torres.onrender.com/movies/' + this.state.imdbid); //doesnt guork
      const res6 = await axios.get('https://pelisapi-production.up.railway.app/api/reviews/movie/' + this.state.imdbid); // scoreAvg edgardo 

      //tratamiento y almacenamiento de datos
      let pano = this.scaleValue(res1.data.rating, [0, 10], [0, 5]);
      if (pano != 0){rates.push(Number(pano.toFixed(2)));}
      if (res2.data.local_rating != 0){rates.push(Number(res2.data.local_rating.toFixed(2)));}
      if (res3.data.rate != 0){rates.push(Number(res3.data.rate.toFixed(2)));}      
      let cesar = this.scaleValue(res4.data.ratingAverage.$numberDecimal, [0, 10], [0, 5]);
      if (cesar != 0){rates.push(Number(cesar.toFixed(2)));}
      if (res6.data.avgScore != 0){rates.push(Number(res6.data.avgScore.toFixed(2)));}   
      //rates.push(this.state.localrating); //mio jeje
      //sumatoria de calificacion global
      let totalRating = rates.length + 1; //se obtiene la cantidad de calificaciones que ha obtenido
      var ratingsum = 0;
      rates.forEach(function(a){ratingsum += a;});
      console.log(rates);
      console.log(ratingsum)
      let actualRating = Number(((ratingsum + Number(this.state.localrating)) / totalRating).toFixed(2)) //promedio real de calificaciones
      console.log(actualRating);
      this.setState({
        ratings: rates,
        globalrating: actualRating
      })
    } catch (error){
      console.error(error);
    }
  }
  render() {
    return (
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={this.state.imgurl} className="img-fluid rounded-start mx-auto d-block p-5" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h1 className="card-title">{this.state.title}</h1><span className="badge bg-warning text-dark"><i className="fas fa-star"></i>{this.state.localrating}</span>
              <span className="badge bg-dark">{this.state.released}</span>
              <span className="badge bg-dark">{this.state.category}</span>
              <p className="card-text p-2">{this.state.synopsis}</p>
              <h4 className='text-center'>Más reseñas</h4>
              <div className='d-flex justify-content-between'>
                {
                  this.state.ratings.map(rate =>(
                    <span className="badge bg-warning text-dark"><i className="fas fa-star"></i>{rate}</span>
                  ))
                }
              </div>
              <h3>Rating Global: <span className="badge bg-warning text-dark"><i className="fas fa-star"></i>{this.state.globalrating}</span></h3>
              <h4>Vota!</h4>
              <div className="input-group">
                <select
                  className="form-control"
                  name="selectedUser"
                  onChange={this.onInputChange}
                  value={this.state.selectedUser}
                >
                  {
                    this.state.users.map(user =>
                      <option key={user._id} value={user.username}>
                        {user.username}
                      </option>)
                  }
                </select>
                <select className='form-select' aria-label='multiple select example' name='selectedVote' onChange={this.onInputChange} >
                  <option selected value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                  <option value='5'>5</option>
                </select>
                <form onSubmit={this.onSubmit}>
                  <button type="submit" className="btn btn-primary mt-2">
                    Review!
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
