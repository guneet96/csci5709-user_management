import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import Header from "../components/navbar";
import { Redirect } from "react-router-dom";
import "../stylesheets/login.css";
import { Col } from "react-bootstrap";

// this code for the validation is referred from https://dev.to/oluwadareseyi/build-dynamic-forms-and-perform-validation-using-react-hooks-with-no-external-package-3i5

const emailCheck = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      // fields added by guneet
      password:"",
      login:false,
      token:null,
      store:null,
      redirect:null,
      error: {
        email: "",
      },
    };
  }
  componentDidMount(){
    this.storeCollector(); 
  }

  storeCollector() {
    console.warn("hello from storecollector")
    let store = JSON.parse(localStorage.getItem('login'));
    this.setState({store:store});
    if(localStorage.getItem('login') !== null){
      this.setState({login:true})
    }
    console.warn(store);
  }

  
  async login() {
    console.warn("Form formData", this.state);
    fetch("http://127.0.0.1:5001/api/login", {
      method:"post",
      body:JSON.stringify(this.state),
    headers:{
      'Content-Type':'application/json',
    }
    }).then(res => res.json())
    .then((result) => {
      console.warn("jatt da token", result.token);
      if(result.token){
        localStorage.setItem('login',JSON.stringify({
          login:true,
          token:result.token
        }))
        this.setState({login:true})
        this.setState({ redirect: "/" });

      }
      else {
        alert('Invalid Credentials');
      }
    })

    // redirect to home
    // history.push
    if(this.state.token){
      console.log("redirect ")
      await this.setState({ redirect: "/" });
    }
    
  }
  
  // code in this function will be used by others
  get_current_user(e) {
    let string = localStorage.getItem('login');
    if(string !== null){
      const token = JSON.parse(string).token;
      console.warn("pushing ", token);
      fetch("http://127.0.0.1:5001/api/current_user", {
        method:"post",
        body:JSON.stringify(this.state),
      headers:{
        'Content-Type':'application/json',
        'x-auth-token': token
      }
      }).then(res => res.json())
      .then((result) => {
        console.warn("result", result);
      })
      }
    else {
      alert('Please login to access this feature!')
    }
  };

  validateForm = (errors) => {
    let valid = true;
    if (this.state.email === "") return false;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.login();
    if (this.validateForm(this.state.error)) {
      // alert("User Has Been Logged In Successfully...");
      this.form.reset();
    } else {
      alert("Invalid Details Entered...");
    }
  };
  handleOnChange = (element) => {
    element.preventDefault();
    const name = element.target.name;
    const value = element.target.value;
    console.log("inside " + name + value);
    let error = this.state.error;
    switch (name) {
      case "email":
        if (document.getElementById("mail").value === "") {
          error.email = "";
          break;
        }
        error.email = emailCheck.test(value) ? "" : "Invalid Email Address";
        break;
      default:
        break;
    }
    this.setState({
      error,
      [name]: value,
    });
  };
  render() {
    const { error } = this.state;
    // console.log("yahan pe hai ",this.state.redirect);
    if (this.state.redirect === "/") {
      // console.log("Insid it");
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div>
        <Header />
        <div className="container my_container">
          <div className="jumbotron box_layout">
            <h2 style={{ textAlign: "center" }}> Log In</h2>
            <p style={{ textAlign: "center" }}>
              {" "}
              Please enter your details to start shopping.
            </p>

            <div className="fields">
              <Form
                onSubmit={this.handleSubmit}
                ref={(form) => (this.form = form)}
              >
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label className="form_lab">
                    {" "}
                    E-mail Address <span className="mandatory">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    id="mail"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    onChange={this.handleOnChange}
                  />

                  {error.email.length > 0 && (
                    <span className=" spn">{error.email}</span>
                  )}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label className="form_lab">
                    Password <span className="mandatory">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    required
                    onChange={(event)=>{this.setState({password:event.target.value})}}
                  />
                </Form.Group>

                <div className="tncbutton">
                  {/* gg int */}
                  <Button variant="primary" type="submit">
                    Log In
                  </Button>
                  <a id="forgot" href="javascript:void(0)">
                    {" "}
                    Forgot Password?{" "}
                  </a>
                  <p id="message">
                    {" "}
                    {/* <Button onClick={(e)=>{this.get_current_user(e)}} variant="primary" type="submit">
                    Current User
                  </Button> */}
                    Not a Registered User?{" "}
                    <a id="clickme" href="/signup">
                      Click Here To Register
                    </a>{" "}
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;
