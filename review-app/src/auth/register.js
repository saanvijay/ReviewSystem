import React from 'react';
import '../review/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios';

class Register extends React.Component 
{
    constructor() {
        super();
        this.state = {
            Name:"",
            Email: "",
            Password:"",
            ConfirmPassword:""
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
            name: this.state.Name,
            email: this.state.Email,
            password: this.state.Password,
            confirmpassword:this.state.Confirmpassword
        }
       // this.props.registerData(data);
        console.log(data);
        axios.post('http://localhost:8000/api/register', data)
        .then(
            res => { 
                this.props.history.push('/login');
        })
        .catch(err => {
            alert(err.response.data);
        })
    }

    componentWillReceiveProps(props) {
        console.log(props.setForm);
    }

    render() {
        return(
                                        
            <form onSubmit = {this.infoSubmit} autoComplete="off">
            <label style={{color: 'brown', fontWeight: 'bold' }}>&nbsp;&nbsp;&nbsp; Register New User</label>
            <div className="form-group">
                <label>&nbsp;&nbsp;&nbsp; Name</label>
                <input type="text" class="form-control" placeholder="Enter User Name" 
                onChange = {this.infoChange}
                name = "Name"
                value = {this.state.Name}
                />
            </div>
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
            <div className="form-group">
                <label>&nbsp;&nbsp;&nbsp; Confirm Password</label>&nbsp;&nbsp;&nbsp;
                <input type="password" class="form-control" placeholder="Confirm Password" 
                onChange = {this.infoChange}
                name = "Confirmpassword"
                value = {this.state.Confirmpassword}
                />
            </div>&nbsp;&nbsp;&nbsp;
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        )
    }
}

export default Register;