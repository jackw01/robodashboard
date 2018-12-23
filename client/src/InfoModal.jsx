// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { MdInfoOutline } from 'react-icons/md';

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
      const content = [];
      Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'staticText';
      }).forEach((k) => {
        content.push(telemetryClient.dashboardItems[k].text);
      });
      this.setState({ content });
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
        <Button className='icon-button' color="secondary" size='sm'onClick={this.toggle.bind(this)}>
          <MdInfoOutline/>
        </Button>
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
