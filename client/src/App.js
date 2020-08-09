import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
//import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, Spinner } from 'react-bootstrap';


class App extends Component {

  state = {
    isLoading: false,
    isSubmitted: false,
    data: {},
    input: ''
  }


  onInputHandler = e =>{
    this.setState({
      input: e.target.value
    })
  }
  onsubmitHandler = e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    })
    fetch('http://localhost:3000/' + this.state.input)
      .then(resp => resp.json())
      .then(data => this.setState({
        isLoading: false,
        isSubmitted: true,
        data: data,
      }))
      .catch(err => console.log(err))
  }
  onButtonClick = () => {
    this.setState({
      isSubmitted: false
    })
  }
  render() {
    if(this.state.isLoading === true){
      return <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}><Spinner animation="border" variant="primary" /></div>
      //
    }
    return (
      <Container style={{marginTop : "100px"}}>
        {this.state.isSubmitted === false ?
          <Form  onSubmit={this.onsubmitHandler}>
            <Form.Control  type="number" placeholder="Enter a number" id="id" onChange={this.onInputHandler} />
            {this.state.input < 1 &&  this.state.input!== '' && <Form.Label style={{color : "red"}}>Please enter a positive number number</Form.Label>}
            <Button disabled = {this.state.input === '' || this.state.input<1} style={{marginTop: "20px" , textAlign:"center"}}  variant="success" type="submit" block>
              Submit
            </Button>
          </Form> :
          <div>
            <Table responsive="sm" striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.state.data).map(key => {
                  return (
                    <tr key = {key}>
                      <td>{key}</td>
                      <td>{this.state.data[key]}</td>
                    </tr>)
                })}
              </tbody>
            </Table>
            <Button variant="info" size="lg" block onClick={this.onButtonClick}>Try a different value</Button>
          </div>
        }
      </Container>
    );
  }
}


export default App;
