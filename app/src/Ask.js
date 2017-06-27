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
    loading: true,
    error: null
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
          <a className="disabled">&lt; prev</a><span>1/25</span>
          <a href="/top/2" className="">more &gt;</a>
        </div>

        <div className="news-list">
          <ul>
            {this.state.details.map(entry =>
              <li className="news-item">
                <h1 className="score"> {entry.data.score} </h1>
                <p>
                  {" "}<a href={entry.data.url}> {entry.data.title} </a>{" "}
                </p>
                <p> By: {entry.data.by} | {entry.data.descendants} comments</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default Top;
