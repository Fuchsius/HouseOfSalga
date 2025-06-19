import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Breadcrumbs from "../components/Breadcrumbs";
import Sidebar from "../components/Sidebar";
import OrderTabs from "../components/OrderTabs";
import OrderList from "../components/OrderList";
import "./Dashboard.css";

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState("In Process");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard">
      
      <Sidebar />

      <div className="main-content">
        {/* breadcrumb */}
        <Breadcrumbs paths={["Home", "My Account", "My Info"]} />

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

        <OrderList selectedStatus={selectedStatus} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
