import React from "react";
import ResourceManager from "./ResourceManager";
import { subscriptionPlansApi } from "../lib/api";

// ResourceManager expects .list()/.create()/.update()/.remove() with a Mongo-style
// _id — subscriptionPlansApi already matches that shape, so it plugs straight in.
const api = {
  list: subscriptionPlansApi.list,
  create: subscriptionPlansApi.create,
  update: subscriptionPlansApi.update,
  remove: subscriptionPlansApi.remove,
};

const columns = [
  { key: "name", label: "Plan name" },
  { key: "durationDays", label: "Duration (days)", type: "number" },
  { key: "price", label: "Price (₹)", type: "number" },
  { key: "description", label: "Description" },
  { key: "features", label: "Features", type: "list" },
  { key: "adLimit", label: "Ad limit", type: "number" },
  { key: "photoLimit", label: "Photo limit", type: "number" },
  { key: "videoLimit", label: "Video limit", type: "number" },
  { key: "active", label: "Active", type: "checkbox" },
];

const emptyItem = { name: "", durationDays: 30, price: 0, description: "", features: [], adLimit: 1, photoLimit: 5, videoLimit: 1, active: true };

export default function AdminSubscriptionPlans() {
  return (
    <ResourceManager
      title="Advertisement Subscription Plans"
      subtitle="Nothing here is hard-coded — prices, durations, and limits are exactly what you set below. New plans start inactive-safe at ₹0 until you set a real price."
      api={api}
      columns={columns}
      emptyItem={emptyItem}
      idKey="_id"
    />
  );
}
