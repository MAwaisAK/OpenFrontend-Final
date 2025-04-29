"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import "@/styles/tools-ui.css";
import { useRouter } from "next/navigation";
import { fetchAllUSerTools } from "@/app/api";

const MyTools = () => {
  const [allTools, setAllTools] = useState([]); // Unfiltered original data
  const [data, setData] = useState([]); // Display data (filtered, sorted)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [activeCategories, setActiveCategories] = useState([]);
  const tableRef = useRef(null);
  const router = useRouter();

  // Fetch tools on mount.
  useEffect(() => {
    const getTools = async () => {
      try {
        const toolsData = await fetchAllUSerTools();
        setAllTools(toolsData);
        setData(toolsData);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    getTools();
  }, []);

  // Compute unique categories from allTools. Active ones are sorted to the top.
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set();
    allTools.forEach((tool) => {
      if (tool.toolCategory) {
        categoriesSet.add(tool.toolCategory);
      }
    });
    const arr = Array.from(categoriesSet);
    arr.sort((a, b) => {
      const aActive = activeCategories.includes(a) ? 0 : 1;
      const bActive = activeCategories.includes(b) ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.localeCompare(b);
    });
    return arr;
  }, [allTools, activeCategories]);

  // Toggle a category filter on/off.
  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((c) => c !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  // Filter and sort data whenever searchQuery, sortColumn, sortAsc, or activeCategories changes.
  useEffect(() => {
    let filtered = allTools.filter((tool) => {
      const query = searchQuery.toLowerCase();
      const priceStr = Array.isArray(tool.price) ? tool.price.join(", ") : tool.price || "";
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.toolCategory.toLowerCase().includes(query) ||
        tool.shortdescription.toLowerCase().includes(query) ||
        priceStr.toLowerCase().includes(query)
      );
    });

    // If any active category filters exist, filter by them (OR logic).
    if (activeCategories.length > 0) {
      filtered = filtered.filter((tool) =>
        activeCategories.includes(tool.toolCategory)
      );
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        let valA, valB;
        switch (sortColumn) {
          case "title":
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
            break;
          case "toolCategory":
            valA = a.toolCategory.toLowerCase();
            valB = b.toolCategory.toLowerCase();
            break;
          case "shortdescription":
            valA = a.shortdescription.toLowerCase();
            valB = b.shortdescription.toLowerCase();
            break;
          case "price":
            valA = Array.isArray(a.price) ? a.price[0] : a.price || "";
            valB = Array.isArray(b.price) ? b.price[0] : b.price || "";
            break;
          default:
            valA = "";
            valB = "";
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    setData([...filtered]);
  }, [searchQuery, sortColumn, sortAsc, activeCategories, allTools]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortAsc ? (
        <i className="mdi mdi-arrow-up"></i>
      ) : (
        <i className="mdi mdi-arrow-down"></i>
      );
    }
    return <i className="mdi mdi-arrow-up"></i>;
  };

  return (
    <main className="tool-ui-table" id="tool-ui-customers_table">
      <section className="tool-ui-table__header">
        <div className="tool-ui-input-group p-2">
          <input
            type="search"
            placeholder="Search Tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="mdi mdi-magnify" aria-hidden="true"></i>
        </div>

        <div className="tool-ui-export__file">
          <label
            htmlFor="tool-ui-export-file"
            className="tool-ui-export__file-btn"
            title="Export File"
          >
            <i className="mdi mdi-archive-search-outline" aria-hidden="true"></i>
          </label>
          <input type="checkbox" id="tool-ui-export-file" />
          <div className="tool-ui-export__file-options">
            {availableCategories.map((category) => (
              <label
                key={category}
                onClick={() => toggleCategory(category)}
                className={`tool-ui-category-btn ${
                  activeCategories.includes(category) ? "active" : ""
                }`}
              >
                {category}{" "}
                {activeCategories.includes(category) && (
                  <i className="mdi mdi-check" aria-hidden="true"></i>
                )}
              </label>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-ui-table__body">
        <table ref={tableRef} className="tool-ui-table-element">
          <thead>
            <tr>
              <th onClick={() => handleSort("title")}>
                Title <span className="tool-ui-icon-arrow">{renderSortIcon("title")}</span>
              </th>
              <th>Thumbnail</th>
              <th onClick={() => handleSort("toolCategory")}>
                Category <span className="tool-ui-icon-arrow">{renderSortIcon("toolCategory")}</span>
              </th>
              <th onClick={() => handleSort("shortdescription")}>
                Description <span className="tool-ui-icon-arrow">{renderSortIcon("shortdescription")}</span>
              </th>
              <th onClick={() => handleSort("price")}>
                Price <span className="tool-ui-icon-arrow">{renderSortIcon("price")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((tool) => (
              <tr key={tool._id} onClick={() => router.push(`/profile/tools/${tool._id}`)}>
                <td>{tool.title}</td>
                <td>
                  <img
                    src={tool.thumbnail}
                    alt={tool.title}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{tool.toolCategory}</td>
                <td>{tool.shortdescription}</td>
                <td>{tool.price[0] === "0" ? "Free" : tool.price[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default MyTools;
