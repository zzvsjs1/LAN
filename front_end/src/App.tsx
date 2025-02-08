import React from 'react';
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

import Header from "./pages/header/Header";
import Home from "./pages/Home";
import Footer from "./pages/footer/Footer";
import NoThisLinkPage from "./pages/error-pages/NoThisLinkPage";
import SignUpPage from "./pages/sign-up/SignUpPage";
import SignInPage from "./pages/sign-in/SignInPage";
import UserProfile from "./pages/userprofile/UserProfile";
import PostingPage from "./pages/posting/PostingPage";
import MyFollowing from "./pages/my_following/MyFollowing";
import ErrorMessagePage from "./pages/error-pages/ErrorMessagePage";

import './App.scss';

/**
 * Nothing special. It just creates the whole App container.
 */
function App() {
  return (
    <div className="App">
      <Header />

      {/* Only change the main part. */}
      <Container as={'main'} className={'main-wrapper'}>
        <Routes>
          {/* The main content list. */}
          <Route path={'/'} element={<Home />} />
          <Route path={'signup'} element={<SignUpPage />} />
          <Route path={'signin'} element={<SignInPage />} />
          <Route path={'userprofile'} element={<UserProfile />} />
          <Route path={'posting'} element={<PostingPage />} />
          <Route path={'myfollowing'} element={<MyFollowing />} />
          <Route path={'error'} element={<ErrorMessagePage />} />
          {/* Invalid page */}
          <Route path="*" element={<NoThisLinkPage />} />
        </Routes>
      </Container>

      <Footer />
    </div>
  );
}

export default App;
