import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardTitle, Button, InputGroup, InputGroupAddon, InputGroupText, Input,
} from 'reactstrap';

import {
  clickRollout, clickSaliency, changeSaliencyRangeLeft, changeSaliencyRangeRight, changeRolloutStep,
} from '../actions';

const path = require('path');

const CommandsContainer = (props) => {
  const {
    saliencyRangeLeft,
    saliencyRangeRight,
    isRolloutReady,
    isSaliencyReady,
    rolloutId,
    rawImageInput,
    rolloutStep,
  } = props;

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Commands</CardTitle>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>max step</InputGroupText>
            </InputGroupAddon>
            <Input
              type="number"
              step="10"
              value={rolloutStep}
              onChange={(e) => {
                props.changeRolloutStep(parseInt(e.target.value, 10));
              }}
            />
          </InputGroup>
          <Button
            onClick={() => { props.clickRollout(rolloutStep); }}
            disabled={!isRolloutReady}
            style={{ marginTop: '8px' }}
          >
            Rollout 1 episode
          </Button>
          {
            rawImageInput && (
              <div>
                <InputGroup style={{ marginTop: '20px' }}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>from</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    step="10"
                    value={saliencyRangeLeft}
                    onChange={(e) => {
                      props.changeSaliencyRangeLeft(parseInt(e.target.value, 10));
                    }}
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText placeholder="step">to</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    step="10"
                    value={saliencyRangeRight}
                    onChange={(e) => {
                      props.changeSaliencyRangeRight(parseInt(e.target.value, 10));
                    }}
                  />
                </InputGroup>
                <Button
                  onClick={() => { props.clickSaliency(rolloutId, saliencyRangeLeft, saliencyRangeRight); }}
                  disabled={!isSaliencyReady}
                  style={{ marginTop: '8px' }}
                >
                  Create saliency map
                </Button>
              </div>
            )
          }
        </CardBody>
      </Card>
    </div>
  );
};


CommandsContainer.propTypes = {
  saliencyRangeLeft: PropTypes.number.isRequired,
  saliencyRangeRight: PropTypes.number.isRequired,
  isRolloutReady: PropTypes.bool.isRequired,
  isSaliencyReady: PropTypes.bool.isRequired,
  rolloutId: PropTypes.string.isRequired,
  rawImageInput: PropTypes.bool.isRequired,
  rolloutStep: PropTypes.number.isRequired,
  clickRollout: PropTypes.func.isRequired,
  clickSaliency: PropTypes.func.isRequired,
  changeSaliencyRangeLeft: PropTypes.func.isRequired,
  changeSaliencyRangeRight: PropTypes.func.isRequired,
  changeRolloutStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  saliencyRangeLeft: state.saliencyRange.saliencyRangeLeft,
  saliencyRangeRight: state.saliencyRange.saliencyRangeRight,
  isRolloutReady: !state.serverState.isJobRunning,
  isSaliencyReady: !state.serverState.isJobRunning && state.serverState.isRolloutOnMemory,
  rolloutId: path.basename(state.log.rolloutPath),
  rawImageInput: state.agentProfile.rawImageInput,
  rolloutStep: state.rollout.stepCount,
});

export default connect(mapStateToProps, {
  clickRollout,
  clickSaliency,
  changeSaliencyRangeLeft,
  changeSaliencyRangeRight,
  changeRolloutStep,
})(CommandsContainer);
