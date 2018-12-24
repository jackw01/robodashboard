// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import { MdSettings } from 'react-icons/md';

import telemetryClient from './model/telemetryclient';

function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

class OptionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      inputGroups: [],
      invalid: {},
    };

    telemetryClient.on('ready', () => {
      const inputGroups = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'inputGroup';
      }).map((k) => telemetryClient.dashboardItems[k]);
      this.setState({ inputGroups });
      console.log(this.state.inputGroups);
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onValueChange(key, control, event) {
    const floatValue = parseFloat(event.target.value);
    const value = clamp(floatValue, control.min, control.max);
    const invalid = value !== floatValue;
    this.setState((state) => {
      const newInvalid = state.invalid;
      newInvalid[key] = invalid;
      return { invalid: newInvalid };
    });
    telemetryClient.handleInputChange(key, value);
  }

  render() {
    return (
      <span className='info-modal-button'>
        <Button className='icon-button' color="secondary" size='sm' onClick={this.toggle.bind(this)}>
          <MdSettings/>
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)} className={this.props.className}>
          <ModalHeader toggle={this.toggle.bind(this)}>Quick Settings</ModalHeader>
          <ModalBody>
            <div>
              {this.state.inputGroups.map((group) => (
                <div>
                  {group.description}:&nbsp;
                  <table class='value-input-table'>
                    {Object.keys(group.controls).map((k) => (
                      <tr>
                        <td>{group.controls[k].label}:&nbsp;</td>
                        <td><Input className='value-input' type='number' step={group.controls[k].step}
                        defaultValue={group.controls[k].default} invalid={this.state.invalid[k]}
                        onChange={this.onValueChange.bind(this, k, group.controls[k])} key={k}/></td>
                      </tr>
                    ))}
                  </table>
                </div>
              ))}
            </div>
          </ModalBody>
        </Modal>
      </span>
    );
  }
}

export default OptionsModal;
