import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
class Top extends Component {
  state = {
    details: [],
    detailsperpage: [],
    loading: true,
    error: null,
    lowerbound: 0,
    upperbound: 20,
    pagenumber: 1
  };
  nextPage = () => {
    if (this.state.upperbound < 60) {
      var lowerbound = (this.state.lowerbound += 20);
      var upperbound = (this.state.upperbound += 20);
      this.setState({
        ...this.state,
        detailsperpage: this.state.details.slice(lowerbound, upperbound),
        pagenumber: (this.state.pagenumber += 1)
      });
    } else {
      this.setState({
        ...this.state,
        detailsperpage: this.state.details.slice(0, 20),
        lowerbound: 0,
        upperbound: 20,
        pagenumber: 1
      });
    }
  };
  prevPage = () => {
    if (this.state.lowerbound == 0) {
      this.setState({
        ...this.state,
        detailsperpage: this.state.details.slice(40, 60),
        lowerbound: 40,
        upperbound: 60,
        pagenumber: 3
      });
    } else {
      var lowerbound = (this.state.lowerbound -= 20);
      var upperbound = (this.state.upperbound -= 20);
      this.setState({
        ...this.state,
        detailsperpage: this.state.details.slice(lowerbound, upperbound),
        pagenumber: (this.state.pagenumber -= 1)
      });
    }
  };
  componentDidMount() {
    axios
      .get("https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty")
      .then(res => {
        let userid = res.data;
        userid.map(userid =>
          axios
            .get(
              "https://hacker-news.firebaseio.com/v0/item/" +
                userid +
                ".json?print=pretty"
            )
            .then(result => {
              let details = this.state.details;
              details.push(result);
              this.setState({
                ...this.state,
                details: details,
                loading: false,
                error: null
              });
              var lowerbound = this.state.lowerbound;
              var upperbound = this.state.upperbound;
              this.setState({
                ...this.state,
                detailsperpage: this.state.details.slice(lowerbound, upperbound)
              });
            })
        );
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
      <li>
        {this.state.details.by}
        <a href={this.state.details.url} target="_blank">
          {" "}{this.state.details.title}{" "}
        </a>
      </li>
    );
  }
  render() {
    const { loading } = this.state;
    return (
      <div className="news-view view">
        <div className="news-list-nav">
          <a onClick={() => this.prevPage()} className="">&lt; prev</a>
          <span>{this.state.pagenumber}/3</span>
          <a onClick={() => this.nextPage()} className="">more &gt;</a>
        </div>

        <div className="news-list">
          <ul>
            {this.state.detailsperpage.map(entry =>
              <li className="news-item">
                <h1 className="score"> {entry.data.score} </h1>
                <p>
                  {" "}<a href={entry.data.url}> {entry.data.title} </a>{" "}
                </p>
                <p>
                  {" "}By:{" "}
                  <a
                    href={"https://vue-hn.now.sh/user/" + entry.data.by}
                    target="_blank"
                  >
                    {entry.data.by}
                  </a>{" "}
                  | {entry.data.descendants} comments
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default Top;
