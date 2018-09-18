import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Label,
} from 'recharts';

import { hoverOnStep } from '../actions';

class DiscreteQvaluesPlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
  }

  render() {
    const { logDataRows, focusedStep } = this.props;

    return (
      <div>
        <LineChart
          width={830}
          height={450}
          data={logDataRows}
          ref={this.chartRef}
          onMouseMove={() => {
            /* eslint-disable-next-line react/destructuring-assignment */
            this.props.hoverOnStep(this.chartRef.current.state.activeLabel);
          }}
        >
          {
            logDataRows.length > 0 && logDataRows[0].qvalues.map((qvalue, idx) => (
              <Line
                type="monotone"
                dot={false}
                dataKey={(v) => v.qvalues[idx]}
                key={idx} /* eslint-disable-line react/no-array-index-key */ // TODO: semantics of qvalues
              />
            ))
          }
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="steps" height={45}>
            <Label value="step" position="insideBottomLeft" offset={5} />
          </XAxis>
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickFormatter={(v) => Number.parseFloat(v).toFixed(2)}
            label={{
              value: 'Qvalue of each action', angle: -90, position: 'insideLeft', offset: 2,
            }}
          />
          <Tooltip />
          <ReferenceLine x={focusedStep} stroke="green" />
        </LineChart>
      </div>
    );
  }
}

DiscreteQvaluesPlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedStep: PropTypes.number.isRequired,
  hoverOnStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  focusedStep: state.plotRange.focusedStep,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(DiscreteQvaluesPlotContainer);
