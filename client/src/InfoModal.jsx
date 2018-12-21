// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaInfo } from 'react-icons/fa';

class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <span className='info-modal-button'>
        <Button color="secondary" size='sm' onClick={this.toggle.bind(this)}><FaInfo/></Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)} className={this.props.className}>
          <ModalHeader toggle={this.toggle.bind(this)}>RoboDashboard</ModalHeader>
          <ModalBody>
            Text
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle.bind(this)}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default InfoModal;
