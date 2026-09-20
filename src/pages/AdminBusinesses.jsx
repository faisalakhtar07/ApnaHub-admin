import React from "react";
import ResourceManager from "./ResourceManager";
import { businessesApi } from "../lib/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "cat", label: "Category" },
  { key: "rating", label: "Rating", type: "number" },
  { key: "reviews", label: "Reviews", type: "number" },
  { key: "loc", label: "Location" },
  { key: "open", label: "Open now", type: "checkbox" },
];

const emptyItem = { name: "", cat: "", rating: 4.5, reviews: 0, loc: "", open: true, img: "" };

export default function AdminBusinesses() {
  return (
    <ResourceManager
      title="Businesses"
      subtitle="Manage listed local businesses."
      api={businessesApi}
      columns={columns}
      emptyItem={emptyItem}
    />
  );
}
