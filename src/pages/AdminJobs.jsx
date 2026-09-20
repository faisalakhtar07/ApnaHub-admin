import React from "react";
import ResourceManager from "./ResourceManager";
import { jobsApi } from "../lib/api";

const columns = [
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
  { key: "type", label: "Type" },
  { key: "exp", label: "Experience" },
  { key: "salary", label: "Salary" },
  { key: "loc", label: "Location" },
];

const emptyItem = { title: "", company: "", type: "Full-time", exp: "", salary: "", loc: "" };

export default function AdminJobs() {
  return (
    <ResourceManager
      title="Jobs"
      subtitle="Manage job postings."
      api={jobsApi}
      columns={columns}
      emptyItem={emptyItem}
    />
  );
}
