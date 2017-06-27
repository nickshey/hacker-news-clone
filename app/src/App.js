import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    details: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    axios
      .get(
        "https://hacker-news.firebaseio.com/v0/item/9128141.json?print=pretty"
      )
      .then(res => {
        let details = res.data;
        this.setState({
          details,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }

  renderDetails() {
    const { error, details } = this.state;
    if (error) {
      return this.renderError();
    }
    return (
      <div>
        {this.state.details.by}
        <a href={this.state.details.url} target="_blank">
          {" "}{this.state.details.title}{" "}
        </a>
      </div>
    );
  }

  render() {
    const { loading } = this.state;
    console.log(this.state.details);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Hacker News</h2>
        </div>
        <p className="App-intro">
          {loading ? this.renderLoading() : this.renderDetails()}
        </p>
      </div>
    );
  }
}

export default App;
