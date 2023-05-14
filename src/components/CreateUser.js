import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class Createuser extends Component {

    state = {
        users: [],
        username: "",
        editing: false,
        _id: ""
    }

    async componentDidMount() {
        //pedimos los datos al backend en cuanto se monte el componente
        this.getUsers();
        const pathArray = window.location.pathname.split('/', 3);
        console.log(pathArray[2])
        if (pathArray[2]) {
            console.log('ejecutando')
            const res = await axios.get('https://moviesapp-api.onrender.com/api/users' + pathArray[2]);
            console.log(pathArray[2])
            this.setState({
                editing: true,
                username: res.data.username,
                _id: pathArray[2]
            })
        }
    }
    onChangeUsername = (e) => {
        console.log(e.target.value)
        this.setState({
            username: e.target.value
        })
    }
    getUsers = async () => {
        const res = await axios.get('https://moviesapp-api.onrender.com/api/users'); //axios para la comunicacion back=front
        this.setState({ users: res.data }); //se almacena en el estado el arreglo de usuarios
    }



    onSubmit = async e => {
        e.preventDefault(); //con esta funcion evitamos reiniciar el navegador
        console.log("hola")
        if (this.state.editing) {
            const editeduser = {
                username: this.state.username
            };
            await axios.put('https://notesapp-api-7xg2.onrender.com/api/users/' + this.state._id, editeduser)
            window.location.href = '/user'; //al guardar redirecciona a la direccion inicial
        } else {
            await axios.post('https://moviesapp-api.onrender.com/api/users', { //enviamos los datos al servidor
                username: this.state.username
            })
            this.setState({username: ''});
            console.log("acaando")
            this.getUsers();
        }
    }

    deleteUser = async (id) => {
        await axios.delete('https://moviesapp-api.onrender.com/api/users/' + id)
        this.getUsers();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Crear nuevo usuario</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-1">
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <ul className="list-group">
                        {
                            this.state.users.map(user => (
                                <li className="list-group-item list-group-item-action d-flex justify-content-between"
                                    key={user._id}
                                    onDoubleClick={() => { if (window.confirm('Estas seguro de que deseas borrar el usuario?')) this.deleteUser(user._id) }}
                                >
                                    {user.username}
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}