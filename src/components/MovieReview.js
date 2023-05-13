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
    const res = await axios.get('https://moviesapp-api.onrender.com/api/movies/' + pathArray[2]);
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
  render() {
    return (
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={this.state.imgurl} className="img-fluid rounded-start" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{this.state.title}</h5><span className="badge bg-warning text-dark"><i className="fas fa-star"></i>{this.state.localrating}</span>
              <span className="badge bg-dark">{this.state.released}</span>
              <span className="badge bg-dark">{this.state.category}</span>
              <p className="card-text">{this.state.synopsis}</p>
              {
                this.state.ratings.map(rate =>(
                  <span className="badge bg-warning text-dark"><i className="fas fa-star"></i>{rate.local}</span>
                ))
              }
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
