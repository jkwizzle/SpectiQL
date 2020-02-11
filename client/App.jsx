import React, { Component } from "react";
import { HashRouter, Route, Link, Switch } from "react-router-dom";
import "./public/styling/index.css";
import Particles from "react-particles-js"; 
import "animate.css/animate.min.css";
import ScrollAnimation from 'react-animate-on-scroll';

//all the components we need
import Main from "./main.jsx";
import Mutations from "./Containers/MutationContainer.jsx";
import LeftSideBar from "./Components/LeftSideBar.jsx";
import SchemaTreeD3 from "./Components/schemaTreeD3.jsx";
import LandingPage from "./Components/LandingPage.jsx";

//functions imported from test
import {
  validQuery,
  invalidQuery,
  validArgField,
  invalidArgField,
  validArgDataType,
  invalidArgDataType,
  validMutation,
  invalidMutation,
} from "./Tests/Tests.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingPageState: true,
      schema: {},
      testSuiteName: "",
      testDescription: "",
      selectedTest: "",
      writeTest: "", 
      writeInput:"",
      generatedTest: "",
      testFunctions: {
                validQuery,
                invalidQuery,
                validArgField,
                invalidArgField,
                validArgDataType,
                invalidArgDataType,
                validMutation,
                invalidMutation
      },
      testSuites: [],
      testIndex: 0,
      testSuiteToggler: true
    };
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addTestSuite = this.addTestSuite.bind(this);
    this.updateTestSuite = this.updateTestSuite.bind(this);
    this.selectTest = this.selectTest.bind(this);
    this.deleteTest = this.deleteTest.bind(this);
    this.editTest = this.editTest.bind(this);
    this.dropDownReset = this.dropDownReset.bind(this);
    this.testSuiteToggler = this.testSuiteToggler.bind(this);
  }

  openDocs() {
    window.open(
      "https://github.com/oslabs-beta/SpectiQL/blob/master/README.md"
    );
  }

  //use this to check if a state changed/altered
  componentDidUpdate() {
    console.log('this is landingPageState', this.state.landingPageState);
}
  

  handleNextClick() {
    fetch('/spectiql', {
      method: 'POST',
    })
    .then(response => response.json())
    .then((response) => {
      schemaData = response.schema;
      this.setState({ landingPageState: false, schema: response.schema});
    })
    .catch(err => console.log(err));
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ [e.target.name]: value });
  }


  handleClick() {
    const value = this.state.testFunctions[this.state.selectedTest](this.state);
    return this.setState({ generatedTest: value });
  }


  selectTest(e) {
    this.setState({
      selectedTest: e.target.value,
      dropDownIndex: e.target.selectedIndex
    });
  }

  addTestSuite() {
    //push the generated test value into the test suites array
    const newTestSuite = {
      savedGeneratedTest: this.state.generatedTest,
      savedTestSuiteName: this.state.testSuiteName,
      savedTestDescription: this.state.testDescription,
      savedWriteTest: this.state.writeTest,
      savedSelectedTest: this.state.selectedTest,
      testIndex: this.state.testIndex + 1
    };
    //shallow copy of array
    let testSuites = this.state.testSuites.slice();
    testSuites.push(newTestSuite);
    return this.setState({
      testSuiteName: "",
      testDescription: "",
      writeTest: "",
      generatedTest: "",
      selectedTest: this.dropDownReset(),
      testIndex: this.state.testIndex + 1,
      testSuites
    });
  }

  updateTestSuite() {
    let testSuites = this.state.testSuites.slice();
    const updatedTestSuite = {
      savedGeneratedTest: this.state.generatedTest,
      savedTestSuiteName: this.state.testSuiteName,
      savedTestDescription: this.state.testDescription,
      savedWriteTest: this.state.writeTest,
      savedSelectedTest: this.state.selectedTest,
      testIndex: this.state.testIndex
    };
    testSuites[updatedTestSuite.testIndex - 1] = updatedTestSuite;
    return this.setState({
      testSuiteName: "",
      testDescription: "",
      writeTest: "",
      generatedTest: "",
      dropDownIndex: 0,
      selectedTest: this.dropDownReset(),
      testSuites,
      testSuiteToggler: true
    })
  }

  editTest(idx) {
    let testSuite = this.state.testSuites[idx - 1];   
    console.log('edit test state', this.state) 
    let dropDownIndex = document.getElementById("dd-reset");
    dropDownIndex.selectedIndex = testSuite.savedDropDownIndex;
    return this.setState({
      testSuiteName: testSuite.savedTestSuiteName,
      testDescription: testSuite.savedTestDescription,
      writeTest: testSuite.savedWriteTest,
      selectedTest: this.dropDownReset(),
      generatedTest: testSuite.savedGeneratedTest,
      testIndex: testSuite.testIndex,
      testSuiteToggler: false
    })
  }

  deleteTest(idx) {
    let testSuites = this.state.testSuites.filter(test => test.testIndex !== idx);
    return this.setState({
      testSuiteName: "",
      testDescription: "",
      writeTest: "",
      generatedTest: "",
      selectedTest: this.dropDownReset(),
      testSuites,
      testIndex: this.state.testIndex - 1,
    });
  }

  dropDownReset() {
    document.getElementById("dd-reset").selectedIndex = 0;
  }

  testSuiteToggler() {
    return this.setState({
      testSuiteToggler: !this.state.testSuiteToggler
    })
  }

  render() {
    let landingPage;
    if (this.state.landingPageState === true) {
      landingPage = <LandingPage landingPageState={this.state.landingPageState} handleNextClick={this.handleNextClick} openDocs={this.openDocs}/>
    }
    //landingPage={this.state.landingPageState} handleNextClick={this.handleNextClick}
    return (
        <HashRouter>
            <div>
              <LeftSideBar/>
            </div>
            <div>
              <SchemaTreeD3 
                schema={this.state.schema}
              />
            </div>
            <div>
              {landingPage}
            </div>
            <Switch>
                <Route path="/main" >
                  <Main appstate={this.state} handleChange={this.handleChange} 
                  handleClick={this.handleClick} addTestSuite={this.addTestSuite} updateTestSuite={this.updateTestSuite} 
                  selectTest={this.selectTest} deleteTest={this.deleteTest} editTest={this.editTest}/>
                </Route>
                

                <Route path="/queries">
                </Route> 

                <Route path="/mutations" exact>
                  <Mutations appstate={this.state} handleChange={this.handleChange} 
                  handleClick={this.handleClick} addTestSuite={this.addTestSuite} updateTestSuite={this.updateTestSuite} 
                  selectTest={this.selectTest} deleteTest={this.deleteTest} editTest={this.editTest}/>
                </Route>

            </Switch>
        </HashRouter>
    );
  }
}

export default App;