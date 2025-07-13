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

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Solace Advocates</h1>
      <div className="bg-white rounded shadow p-4 mb-8 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={pendingSearch}
            placeholder="Search advocates..."
            autoComplete="off"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={onClick}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mb-4 text-gray-600 text-sm">
        {searchTerm && (
          <span>Searching for: <span className="font-semibold">{searchTerm}</span></span>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-500">Loading advocates...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center h-40">
          <span className="text-red-600 mb-2">Error: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">First Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">Last Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">City</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">Degree</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">Specialties</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">Years of Experience</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {advocates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No advocates found matching your search.
                    </td>
                  </tr>
                ) : (
                  advocates.map((advocate, index) => (
                    <tr key={`${advocate.firstName}-${advocate.lastName}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{advocate.firstName}</td>
                      <td className="px-4 py-2 border-b">{advocate.lastName}</td>
                      <td className="px-4 py-2 border-b">{advocate.city}</td>
                      <td className="px-4 py-2 border-b">{advocate.degree}</td>
                      <td className="px-4 py-2 border-b">
                        {advocate.specialties.map((specialty, specialtyIndex) => (
                          <div key={`${specialty}-${specialtyIndex}`}>{specialty}</div>
                        ))}
                      </td>
                      <td className="px-4 py-2 border-b">{advocate.yearsOfExperience}</td>
                      <td className="px-4 py-2 border-b">{advocate.phoneNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} results)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
