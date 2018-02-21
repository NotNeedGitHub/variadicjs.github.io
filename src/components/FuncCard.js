import React, {PureComponent} from 'react';
import "./FuncCard.css";
import FuncCode from './FuncCode';
import FuncParams from './FuncParams';
import FuncResult from './FuncResult';
import {Card, Button, Modal} from "react-materialize";
import { version } from 'variadic.js/package.json';

class FuncCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: [],
      result: '',
      showCode: false,
      code: '',
      error: '',
    };

    this.handleToggleCode = this.handleToggleCode.bind(this);
    this.handleParamsChange = this.handleParamsChange.bind(this);
    this.handleRunCode = this.handleRunCode.bind(this);
  }

  fetchCode(func) {
    fetch(`https://raw.githubusercontent.com/variadicjs/variadic.js/v${version}/lib/${func}.js`).then((response) => {
      response.text().then((data) => {
        this.setState({code: data});
      });
    })
  }

  componentDidMount() {
    this.fetchCode(this.props.funcName);
  }

  handleParamsChange(params, e) {
    this.setState({params: params, result: '', error: ''});
  }

  handleRunCode(e) {
    let funcName = this.props.funcName;
    let params = this.state.params;
    try {
      let result = this.props.func(...params);
      this.setState({result: result, error: ''});
    }
    catch(err) {
      this.setState({result: '', error: err.message})
    }
    this.props.onClickHandler(funcName);
  }

  handleToggleCode(e) {
    this.setState(prevState => ({showCode: !prevState.showCode}));
  }

  render() {
    const {
      funcName,
      subtitle,
    } = this.props;
    const {
      params,
      result,
      error,
      code
    } = this.state;

    return (
      <Card 
        className="custom-card"
        title={funcName}>
        <p style={{color: "#7D7D7D", marginBottom: "10px"}}>{subtitle}</p>
        <FuncParams
            funcName={funcName}
            params={params}
            error={error}
            onParamsChange={this.handleParamsChange}
            onSubmit={this.handleParamSubmit}
          />

        <FuncResult
          funcName={funcName}
          params={params}
          result={result}
        />
        
        <Button onClick={this.handleRunCode}>Run</Button>

        <Modal
          header={`variadic.${funcName}()`}
          open={this.state.showCode}
          trigger={<Button onClick={this.handleToggleCode} className="button">Show Code</Button>}
        >
          <FuncCode code={code}/>
        </Modal>
      </Card>
    )
  }
}

export default FuncCard;
