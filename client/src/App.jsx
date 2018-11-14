import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>Test Column</Col>
            <Col>Test Column</Col>
            <Col>Test Column</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
