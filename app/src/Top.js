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
  render() {
    return (
      <div className="news-view view">
        <div className="news-list-nav">
          <a className="disabled">&lt; prev</a><span>1/25</span>
          <a href="/top/2" className="">more &gt;</a>
        </div>
        Top
      </div>
    );
  }
}
export default Top;
