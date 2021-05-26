import React from 'react';
import '../review/App.css';
import axios from 'axios';

class Login extends React.Component 
{
    constructor() {
        super();
        this.state = {
            Email: "",
            Password:""
        }
    }
    infoChange = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }
    infoSubmit = event => {
        event.preventDefault();

        let data = {
            email: this.state.Email,
            password: this.state.Password
        }
        console.log(data);
        axios.post('http://localhost:8000/api/login', data)
        .then(
            res => { 
               localStorage.setItem('auth', JSON.stringify(res.data));
               this.props.history.push('/home');
        })
        .catch(error => {
            alert(error.response.data);
        })
    }

    infoSubmitReg = event => {
        event.preventDefault();
        window.location.href = 'register';
        
    }

    componentWillReceiveProps(props) {
        console.log(props.setForm);
    }

    render() {
        return(
                                        
            <form  autoComplete="off">
            <label style={{color: 'brown', fontWeight: 'bold' }}>&nbsp;&nbsp;&nbsp; Login </label>
            
            <div className="form-group">
                <label>&nbsp;&nbsp;&nbsp; Email</label>&nbsp;&nbsp;&nbsp;
                <input type="text" class="form-control" placeholder="Enter Email" 
                onChange = {this.infoChange}
                name = "Email"
                value = {this.state.Email}
                />
            </div>
            <div className="form-group">
                <label>&nbsp;&nbsp;&nbsp; Password</label>&nbsp;&nbsp;&nbsp;
                <input type="password" class="form-control" placeholder="Enter Password" 
                onChange = {this.infoChange}
                name = "Password"
                value = {this.state.Password}
                />
            </div>
            &nbsp;&nbsp;&nbsp;
            <button type="submit" onClick = {this.infoSubmit} class="btn btn-primary">Login</button>
            &nbsp;&nbsp;&nbsp;
            <button  onClick = {this.infoSubmitReg} class="btn btn-primary">Register</button>
            </form>
        )
    }
}

export default Login;