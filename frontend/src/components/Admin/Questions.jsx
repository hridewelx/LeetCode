import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    status: "",
  });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState("title");
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchQuestions();
    }
  }, [isAuthenticated, user]);

  const fetchQuestions = async () => {
    try {
      const { data } = await axiosClient.get("problems/problemset");
      setQuestions(data.problems || []);
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axiosClient.delete(`/problems/problemfetchbyid/${id}`);
      toast.success("Question deleted successfully");
      fetchQuestions();
      setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      toast.error("Please select questions to delete");
      return;
    }

    if (!window.confirm(`Delete ${selected.length} selected questions?`))
      return;

    try {
      await Promise.all(
        selected.map((id) =>
          axiosClient.delete(`/problems/problemfetchbyid/${id}`)
        )
      );
      toast.success(`${selected.length} questions deleted successfully`);
      setSelected([]);
      fetchQuestions();
    } catch (error) {
      toast.error("Failed to delete questions");
    }
  };

  const handleBulkPublish = async () => {
    if (selected.length === 0) {
      toast.error("Please select questions to publish");
      return;
    }
    toast.success(`${selected.length} questions published`);
    setSelected([]);
  };

  // Enhanced filtering and sorting
  const filteredAndSortedQuestions = questions
    .filter((q) => {
      const searchMatch =
        !filters.search ||
        q.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        );

      const difficultyMatch =
        !filters.difficulty || q.difficulty === filters.difficulty;
      const statusMatch = !filters.status || q.status === filters.status;

      return searchMatch && difficultyMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title?.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const stats = {
    total: questions.length,
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
    filtered: filteredAndSortedQuestions.length,
    selected: selected.length,
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Administrator privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Question Bank
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your problem library efficiently
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>

          {/* Add Question Button */}
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "blue",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            ),
          },
          {
            label: "Easy",
            value: stats.easy,
            color: "green",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            ),
          },
          {
            label: "Medium",
            value: stats.medium,
            color: "amber",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            ),
          },
          {
            label: "Hard",
            value: stats.hard,
            color: "red",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
          },
          {
            label: "Filtered",
            value: stats.filtered,
            color: "purple",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
            ),
          },
          {
            label: "Selected",
            value: stats.selected,
            color: "cyan",
            icon: (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            ),
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-2xl font-bold text-${stat.color}-400 group-hover:scale-105 transition-transform duration-300`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
              <div
                className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center group-hover:bg-${stat.color}-500/30 transition-colors duration-300`}
              >
                <span className="text-lg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">
                  {selected.length} question{selected.length > 1 ? "s" : ""}{" "}
                  selected
                </p>
                <p className="text-slate-300 text-sm">
                  Choose an action to perform
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleBulkPublish}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Publish</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete</span>
              </button>
              <button
                onClick={() => setSelected([])}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              placeholder="Search questions by title or tags..."
              className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 flex-1"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <select
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading questions...</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
          {viewMode === "table" ? (
            // Table View
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="p-4 text-left text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                      checked={
                        selected.length === filteredAndSortedQuestions.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(
                            filteredAndSortedQuestions.map((q) => q._id)
                          );
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-4 text-left text-slate-300 font-semibold">
                    Title
                  </th>
                  <th className="p-4 text-left text-slate-300 font-semibold">
                    Difficulty
                  </th>
                  <th className="p-4 text-left text-slate-300 font-semibold">
                    Tags
                  </th>
                  <th className="p-4 text-left text-slate-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedQuestions.map((question) => (
                  <tr
                    key={question._id}
                    className={`border-b border-slate-700 transition-colors duration-200 ${
                      selected.includes(question._id)
                        ? "bg-blue-500/10 hover:bg-blue-500/15"
                        : "hover:bg-slate-700/30"
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                        checked={selected.includes(question._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected((prev) => [...prev, question._id]);
                          } else {
                            setSelected((prev) =>
                              prev.filter((id) => id !== question._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {question.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {question.tags?.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded-full text-xs font-medium border border-blue-400/20">
                            {tag}
                          </span>
                        ))}
                        {question.tags?.length > 3 && (
                          <span className="px-2 py-1 bg-slate-600 text-slate-400 rounded text-xs">
                            +{question.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            /* Edit functionality */
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(question._id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredAndSortedQuestions.map((question) => (
                <div
                  key={question._id}
                  className={`bg-slate-700/30 rounded-xl p-4 border transition-all duration-200 hover:transform hover:-translate-y-1 ${
                    selected.includes(question._id)
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                      checked={selected.includes(question._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => [...prev, question._id]);
                        } else {
                          setSelected((prev) =>
                            prev.filter((id) => id !== question._id)
                          );
                        }
                      }}
                    />
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {question.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {question.tags?.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded-full text-xs font-medium border border-blue-400/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 p-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <span className="text-slate-400 text-sm">0 views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="text-blue-400 hover:text-blue-300 p-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-64 text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No questions found
          </h3>
          <p className="text-slate-400 mb-4">
            {filters.search || filters.difficulty
              ? "Try adjusting your filters"
              : "Get started by adding your first question"}
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors duration-200">
            Add First Question
          </button>
        </div>
      )}
    </div>
  );
};

export default Questions;
