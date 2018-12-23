// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { FaInfo } from 'react-icons/fa';

import telemetryClient from './model/telemetryclient';

class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      content: [],
      inputGroups: [],
    };

    telemetryClient.on('ready', () => {
      Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'staticText';
      }).forEach((k) => {
        this.state.content.push(telemetryClient.dashboardItems[k].text);
      });
      this.state.inputGroups = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'inputGroup';
      }).map((k) => telemetryClient.dashboardItems[k]);
      console.log(this.state.inputGroups);
    });
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
            {this.state.content.map((string) => <div>{string}</div>)}
          </ModalBody>
        </Modal>
      </span>
    );
  }
}

export default InfoModal;
