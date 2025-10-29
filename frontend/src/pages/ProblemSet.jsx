import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { userLogout } from "../authenticationSlicer";
import { NavLink } from "react-router";

function ProblemSet() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authentication);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problems/problemset");
        console.log("fetched problems", data);
        setProblems(data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problems/individualsolved");
        console.log("fetched solved problems", data);
        setSolvedProblems(data.problems);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [dispatch, user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
    const tagMatch =
      filters.tag === "all" ||
      (Array.isArray(problem.tags)
        ? problem.tags.some(
            (tag) => tag.toLowerCase() === filters.tag.toLowerCase()
          )
        : problem.tags.toLowerCase() === filters.tag.toLowerCase());

    const statusMatch =
      filters.status === "all" ||
      solvedProblems.some((sp) => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const handleLogout = () => {
    dispatch(userLogout());
    setSolvedProblems([]);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 border-green-400";
      case "medium":
        return "text-yellow-400 border-yellow-400";
      case "hard":
        return "text-red-400 border-red-400";
      default:
        return "text-slate-400 border-slate-400";
    }
  };

  const getStatusColor = (solved) => {
    return solved ? "text-green-400" : "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-800/70 backdrop-blur-sm border-b border-slate-700/50 shadow-lg shadow-black/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <NavLink
              to="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
            >
              AlgoForge
            </NavLink>
          </div>

          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Dashboard
            </NavLink>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
                <span className="font-medium">{user?.firstName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul className="mt-2 p-2 shadow-2xl menu dropdown-content bg-slate-800/90 backdrop-blur-sm rounded-box w-52 border border-slate-700/50">
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Problem Set</h1>
          <p className="text-slate-400 font-semibold">
            Sharpen your skills with our curated collection of coding challenges
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl shadow-black/30">
          <div className="flex flex-wrap gap-4 w-full">
            <select
              className="select bg-slate-700/50 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved Problems</option>
            </select>

            <select
              className="select bg-slate-700/50 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              className="select bg-slate-700/50 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            >
              <option value="array">Array</option>
              <option value="string">String</option>
              <option value="hash table">Hash Table</option>
              <option value="math">Math</option>
              <option value="dynamic programming">Dynamic Programming</option>
              <option value="sorting">Sorting</option>
              <option value="greedy">Greedy</option>
              <option value="depth-first search">Depth-First Search</option>
              <option value="binary search">Binary Search</option>
              <option value="database">Database</option>
              <option value="matrix">Matrix</option>
              <option value="bit manipulation">Bit Manipulation</option>
              <option value="tree">Tree</option>
              <option value="breadth-first search">Breadth-First Search</option>
              <option value="two pointers">Two Pointers</option>
              <option value="prefix sum">Prefix Sum</option>
              <option value="heap (priority queue)">Heap (Priority Queue)</option>
              <option value="simulation">Simulation</option>
              <option value="counting">Counting</option>
              <option value="graph">Graph</option>
              <option value="binary tree">Binary Tree</option>
              <option value="stack">Stack</option>
              <option value="sliding window">Sliding Window</option>
              <option value="design">Design</option>
              <option value="enumeration">Enumeration</option>
              <option value="backtracking">Backtracking</option>
              <option value="union find">Union Find</option>
              <option value="number theory">Number Theory</option>
              <option value="linked list">Linked List</option>
              <option value="ordered set">Ordered Set</option>
              <option value="monotonic stack">Monotonic Stack</option>
              <option value="segment tree">Segment Tree</option>
              <option value="trie">Trie</option>
              <option value="combinatorics">Combinatorics</option>
              <option value="divide and conquer">Divide and Conquer</option>
              <option value="bitmask">Bitmask</option>
              <option value="queue">Queue</option>
              <option value="recursion">Recursion</option>
              <option value="geometry">Geometry</option>
              <option value="binary indexed tree">Binary Indexed Tree</option>
              <option value="memoization">Memoization</option>
              <option value="hash function">Hash Function</option>
              <option value="binary search tree">Binary Search Tree</option>
              <option value="shortest path">Shortest Path</option>
              <option value="string matching">String Matching</option>
              <option value="topological sort">Topological Sort</option>
              <option value="rolling hash">Rolling Hash</option>
              <option value="game theory">Game Theory</option>
              <option value="interactive">Interactive</option>
              <option value="data stream">Data Stream</option>
              <option value="monotonic queue">Monotonic Queue</option>
              <option value="brainteaser">Brainteaser</option>
              <option value="doubly-linked list">Doubly-Linked List</option>
              <option value="randomized">Randomized</option>
              <option value="merge sort">Merge Sort</option>
              <option value="counting sort">Counting Sort</option>
              <option value="iterator">Iterator</option>
              <option value="concurrency">Concurrency</option>
              <option value="line sweep">Line Sweep</option>
              <option value="probability and statistics">Probability and Statistics</option>
              <option value="quickselect">Quickselect</option>
              <option value="suffix array">Suffix Array</option>
              <option value="minimum spanning tree">Minimum Spanning Tree</option>
              <option value="bucket sort">Bucket Sort</option>
              <option value="shell">Shell</option>
              <option value="reservoir sampling">Reservoir Sampling</option>
              <option value="strongly connected component">Strongly Connected Component</option>
              <option value="eulerian circuit">Eulerian Circuit</option>
              <option value="radix sort">Radix Sort</option>
              <option value="rejection sampling">Rejection Sampling</option>
              <option value="biconnected component">Biconnected Component</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">
                No problems found matching your filters.
              </div>
              <button
                onClick={() =>
                  setFilters({ difficulty: "all", tag: "all", status: "all" })
                }
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedProblems.some(
                (sp) => sp._id === problem._id
              );
              return (
                <div
                  key={problem._id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 hover:border-slate-600/50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="hover:text-blue-400"
                          >
                            {problem.title}
                          </NavLink>
                        </h2>
                        {isSolved && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-sm font-medium">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Solved
                          </div>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 border rounded-full text-sm font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        {problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-400 text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                      >
                        Solve Challenge
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-2xl font-bold text-white">
                {problems.length}
              </div>
              <div className="text-slate-400 text-sm">Total Problems</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-2xl font-bold text-white">
                {solvedProblems.length}
              </div>
              <div className="text-slate-400 text-sm">Problems Solved</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-2xl font-bold text-white">
                {problems.length > 0
                  ? Math.round((solvedProblems.length / problems.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-slate-400 text-sm">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemSet;