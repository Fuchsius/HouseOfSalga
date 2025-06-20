import React from "react";
import EmptyWishlist from "./components/EmptyWishlist"; // update the path if needed
import Header from "./components/Header"; // update the path if needed    
import Footer from "./components/Footer"; // update the path if needed
function App() {
  return (
    <div>
      <Header />
      <EmptyWishlist />
      <Footer/>
    </div>
  );
}

export default App;
