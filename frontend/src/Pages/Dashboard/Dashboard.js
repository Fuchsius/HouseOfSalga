import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Sidebar from "../../Components/Sidebar/Sidebar";
import OrderTabs from "../../Components/OrderTabs/OrderTabs";
import OrderList from "../../Components/OrderList/OrderList";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

import "./Dashboard.css";

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState("In Process");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false); // ✅ Control user menu from here

  return (
    <>
      <Header
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
      />

      <div className="dashboard">
        <Sidebar onMyAccountClick={() => setShowUserMenu(true)} />

        <div className="main-content">
          <div className="orders-header">
            <h2>My Orders</h2>

            <div className="search-filter">
              <div className="search-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder=" Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="filter-btn">
                Filter <FiFilter className="filter-icon" />
              </button>
            </div>
          </div>

          <OrderTabs
            selectedStatus={selectedStatus}
            onChangeStatus={setSelectedStatus}
          />

          <OrderList
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
