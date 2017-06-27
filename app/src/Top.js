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
    if (this.state.upperbound < 500) {
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
        detailsperpage: this.state.details.slice(480, 500),
        lowerbound: 480,
        upperbound: 500,
        pagenumber: 25
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
  componentWillMount() {
    axios
      .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
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
          <span>{this.state.pagenumber}/25</span>
          <a onClick={() => this.nextPage()} className="">more &gt;</a>

        </div>

        <div className="news-list">
          <ul>
            {this.state.detailsperpage.map(entry =>
              <li className="news-item">
                <span className="score">{entry.data.score}</span>
                <span className="title">
                  <a href={entry.data.url} target="_blank" rel="noopener">
                    {entry.data.title}
                  </a>
                </span>
                <br />
                <span className="meta">
                  <span className="by">
                    by <a href={"/user/" + entry.data.by} className="" />
                    {entry.data.by}
                  </span>
                  <span className="time">
                    {entry.data.time}
                  </span>
                  <span className="comments-link">
                    |{" "}
                    <a href="/item/14644539" className="">
                      {entry.data.descendants} comments
                    </a>
                  </span>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default Top;
