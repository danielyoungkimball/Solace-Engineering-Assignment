"use client";

import { useEffect, useState } from "react";

interface Advocate {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [pendingSearch, setPendingSearch] = useState<string>("");
  const limit = 10;

  const fetchAdvocates = async (q = "", pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        q,
        page: pageNum.toString(),
        limit: limit.toString(),
      });
      const response = await fetch(`/api/advocates?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
    } catch (err) {
      console.error("Error fetching advocates:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch advocates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates(searchTerm, page);
  }, [searchTerm, page]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearch(e.target.value);
  };

  const onSearch = () => {
    setSearchTerm(pendingSearch);
    setPage(1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const onClick = () => {
    setPendingSearch("");
    setSearchTerm("");
    setPage(1);
  };

  const handlePrev = () => {
    if (pagination && page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (pagination && page < pagination.totalPages) setPage(page + 1);
  };

  if (loading) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={pendingSearch}
          placeholder="Search advocates..."
        />
        <button onClick={onSearch}>Search</button>
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate, index) => {
            return (
              <tr key={`${advocate.firstName}-${advocate.lastName}-${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty, specialtyIndex) => (
                    <div key={`${specialty}-${specialtyIndex}`}>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {advocates.length === 0 && searchTerm && (
        <p>No advocates found matching your search.</p>
      )}
      <br />
      {pagination && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={handlePrev} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button onClick={handleNext} disabled={page === pagination.totalPages}>
            Next
          </button>
        </div>
      )}
    </main>
  );
}
