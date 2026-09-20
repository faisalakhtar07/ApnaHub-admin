import React from "react";
import ResourceManager from "./ResourceManager";
import { listingsApi } from "../lib/api";

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "cond", label: "Condition" },
  { key: "loc", label: "Location" },
  { key: "seller", label: "Seller" },
  { key: "status", label: "Status" },
];

const emptyItem = { title: "", price: "", cond: "Used – Good", loc: "", seller: "", img: "", category: "Other", status: "approved" };

export default function AdminListings() {
  return (
    <ResourceManager
      title="Buy & Sell Listings"
      subtitle="Manage marketplace listings. Seller-submitted ads come in as 'pending' — edit the Status field to 'approved' or 'rejected' to moderate them."
      api={listingsApi}
      columns={columns}
      emptyItem={emptyItem}
    />
  );
}
