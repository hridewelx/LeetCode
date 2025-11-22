import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import UserAvatar from "../components/UI/UserAvatar";
import AuthButton from "../components/UI/AuthButton";
import {
  Code2,
  Zap,
  BarChart3,
  Users,
  Binary,
  Workflow,
  Network,
  Database,
  Lock,
  ArrowRight,
  Clock,
} from "lucide-react";

// --- Sub-components & Icons ---

const SocialIcon = ({ platform }) => {
  const icons = {
    github: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
    twitter: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
    youtube: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  };

  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      {icons[platform]}
    </svg>
  );
};

const FeatureCard = ({ icon, title, description, stat }) => (
  <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-800/50 hover:from-blue-500/50 hover:to-purple-500/50 transition-all duration-300">
    <div className="relative h-full p-6 bg-slate-900 rounded-xl border border-slate-700/50 group-hover:border-transparent transition-colors">
      <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <div className="text-blue-400 text-xs font-bold tracking-wider uppercase px-2 py-1 rounded bg-blue-500/10 inline-block">
        {stat}
      </div>
    </div>
  </div>
);

// --- Main Component ---
const Homepage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
  });

  // Mouse Tilt Logic
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    // Calculate rotation based on mouse position relative to center
    const rotateX = (centerY - y) / 20;
    const rotateY = (x - centerX) / 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    // Reset to flat when mouse leaves
    setRotate({ x: 0, y: 0 });
  };

  // Data Fetching Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get("/problems/problemset"),
          isAuthenticated
            ? axiosClient.get("/problems/individualsolved")
            : Promise.resolve({ data: { problems: [] } }),
        ]);

        const problems = problemsRes.data.problems || [];
        const solved = solvedRes.data.problems || [];

        setStats({
          totalProblems: problems.length,
          solvedProblems: solved.length,
          easyCount: problems.filter((p) => p.difficulty === "Easy").length,
          mediumCount: problems.filter((p) => p.difficulty === "Medium").length,
          hardCount: problems.filter((p) => p.difficulty === "Hard").length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, isAuthenticated]);

  // Animation Logic
  useEffect(() => {
    if (!isLoading) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(animatedStats).forEach((key) => {
        const target = stats[key];
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, stepDuration);
      });
    }
  }, [isLoading, stats]);

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Curated Problems",
      description:
        "Challenges selected from actual interviews at FAANG and top tier tech companies.",
      stat: `${stats.totalProblems}+ PROBLEMS`,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Execution",
      description:
        "Run your code in a secure, isolated sandbox with support for 10+ languages.",
      stat: "< 100ms LATENCY",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Detailed Analytics",
      description:
        "Visualise your progress, identify weak spots, and track time complexity.",
      stat: `${stats.solvedProblems} SOLVED`,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Support",
      description:
        "Join discussion forums, read editorials, and get unstuck with peer help.",
      stat: "ACTIVE COMMUNITY",
    },
  ];

  // --- Icons for Courses ---
  const CourseIcons = {
    visualizer: <Binary className="w-6 h-6 text-white" />,
    patterns: <Workflow className="w-6 h-6 text-white" />,
    system: <Network className="w-6 h-6 text-white" />,
    database: <Database className="w-6 h-6 text-white" />,
  };

  // --- Updated Data ---
  const courses = [
    {
      title: "DSA Visualizer",
      description:
        "Interactive playground to visualize arrays, trees, graphs, and sorting algorithms in real-time.",
      level: "All Levels",
      duration: "Unlimited",
      students: "12k+",
      icon: CourseIcons.visualizer,
      color: "from-blue-600 to-violet-600",
      shadow: "shadow-blue-500/20",
      status: "active",
      cta: "Launch Visualizer",
    },
    {
      title: "Algorithm Patterns",
      description:
        "Master DP, greedy algorithms, and divide & conquer techniques.",
      level: "Intermediate",
      duration: "4 weeks",
      students: "1.8k",
      icon: CourseIcons.patterns,
      color: "from-pink-600 to-rose-600",
      shadow: "shadow-pink-500/20",
      status: "coming_soon",
      cta: "Notify Me",
    },
    {
      title: "System Design",
      description:
        "Learn to design scalable distributed systems for senior interviews.",
      level: "Advanced",
      duration: "8 weeks",
      students: "1.2k",
      icon: CourseIcons.system,
      color: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      status: "coming_soon",
      cta: "Notify Me",
    },
    {
      title: "SQL & Databases",
      description:
        "Deep dive into relational databases, normalization and indexing.",
      level: "Intermediate",
      duration: "3 weeks",
      students: "3.1k",
      icon: CourseIcons.database,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      status: "coming_soon",
      cta: "Notify Me",
    },
  ];

  const CourseCard = ({ course }) => {
    const isAvailable = course.status === "active";

    return (
      <div
        className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 
      ${
        isAvailable
          ? "bg-slate-900/80 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1"
          : "bg-slate-900/40 border border-slate-800 opacity-75 hover:opacity-100"
      }`}
      >
        {/* "Coming Soon" Overlay Pattern for inactive cards */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        )}

        <div className="p-6 flex-grow relative">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-5">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                isAvailable ? course.color : "from-slate-700 to-slate-600"
              } flex items-center justify-center shadow-lg`}
            >
              {course.icon}
            </div>

            {isAvailable ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                LIVE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SOON
              </span>
            )}
          </div>

          {/* Content Section */}
          <h3
            className={`text-xl font-bold mb-2 ${
              isAvailable ? "text-white" : "text-slate-300"
            }`}
          >
            {course.title}
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {course.description}
          </p>

          {/* Stats Row (Hidden if coming soon to reduce clutter, or keep if preferred) */}
          {isAvailable && (
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-2">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {course.students} users
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Real-time
              </span>
            </div>
          )}
        </div>

        {/* Footer Action Area */}
        <div
          className={`p-4 border-t ${
            isAvailable
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-slate-900/50 border-slate-800"
          }`}
        >
          <button
            disabled={!isAvailable}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${
              isAvailable
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            {course.cta}
            {isAvailable && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AlgoForge
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink
                to="/problemset"
                className={({ isActive }) =>
                  `hover:text-white transition-colors ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                Problems
              </NavLink>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `hover:text-white transition-colors ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                Courses
              </NavLink>
            </div>
            <div className="pl-6 border-l border-white/10">
              {isAuthenticated ? <UserAvatar /> : <AuthButton />}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-20 pb-32 px-6">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                Forge Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Coding Legacy
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                The ultimate platform to master algorithms, ace technical
                interviews, and elevate your engineering career.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/problemset")}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-900/20"
                >
                  Start Solving
                </button>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  View Courses
                </button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-slate-800/50">
                {[
                  { label: "Problems", value: animatedStats.totalProblems },
                  { label: "Solved Users", value: "10K+" },
                  { label: "Success Rate", value: "94%" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative perspective-1000 mt-8 lg:mt-0">
              {/* Background Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>

              {/* 3D Tilt Container */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                  transition: "transform 0.1s ease-out",
                }}
                className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden cursor-default transform-gpu"
              >
                {/* Editor Header */}
                <div className="flex items-center px-4 py-3 bg-slate-800/50 border-b border-slate-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.13-.31.2-.28.25-.26.31-.24.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04h3.87l.75.04.69.08.61.13.53.18.43.23.34.28zM22.46 9.75l.05.24.05.32.05.36.02.36v3.06l-.01.13-.04.26-.1.3-.16.33-.25.34-.34.34-.45.32-.59.3-.73.26-.9.2h-3.53v.83h5.69v2.75l.01.28-.02.37-.05.34-.13.31-.2.28-.25.26-.31.24-.38.2-.44.18-.51.15-.58.12-.64.1-.72.06-.76.04h-3.87l-.75-.04-.69-.08-.61-.13-.53-.18-.43-.23-.34-.28-.25-.31-.18-.33-.1-.34-.04-.33v-3.06l.02-.21.04-.27.07-.32.1-.35.15-.37.2-.36.27-.35.33-.32.41-.27.5-.22.59-.14.69-.05h5.46l.21-.02.26-.04.3-.07.33-.1.35-.14.35-.19.33-.25.3-.31.26-.38.21-.46.13-.55.05-.63V9.75h1.61z" />
                    </svg>
                    <span className="text-xs text-slate-500 font-mono">
                      solution.py
                    </span>
                  </div>
                </div>

                {/* Python Code Body */}
                <div className="p-6 space-y-1 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="text-purple-400">
                    def <span className="text-blue-400">max_sub_array</span>(
                    <span className="text-orange-400">nums</span>):
                  </div>
                  <div className="pl-6 text-slate-300">
                    current_sum = nums[<span className="text-green-400">0</span>
                    ]
                  </div>
                  <div className="pl-6 text-slate-300">
                    max_sum = nums[<span className="text-green-400">0</span>]
                  </div>
                  <div className="pl-6 text-slate-500 italic">
                    # Kadane's Algorithm
                  </div>
                  <div className="pl-6 text-purple-400">
                    for <span className="text-white">num</span> in{" "}
                    <span className="text-white">nums</span>[
                    <span className="text-green-400">1</span>:]:
                  </div>
                  <div className="pl-12 text-slate-300">
                    current_sum = <span className="text-yellow-400">max</span>
                    (num, current_sum + num)
                  </div>
                  <div className="pl-12 text-slate-300">
                    max_sum = <span className="text-yellow-400">max</span>
                    (max_sum, current_sum)
                  </div>
                  <br />
                  <div className="pl-6 text-purple-400">
                    return <span className="text-slate-300">max_sum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-24 px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why AlgoForge?
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                We provide the infrastructure you need to stop memorizing and
                start understanding.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-24 px-6 bg-slate-900/50 border-y border-slate-800">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Interactive Learning
                </h2>
                <p className="text-slate-400 max-w-md">
                  Start with our visualizer today. Detailed structured courses
                  are currently in production.
                </p>
              </div>
              <button
                onClick={() => navigate("/courses")}
                className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                View all courses
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5"></div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-12 text-center shadow-2xl overflow-hidden relative">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to level up?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of developers who are currently practicing for
                their next big interview. The compiler is waiting.
              </p>

              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/problemset" : "/signup")
                }
                className="px-10 py-4 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-white/10"
              >
                {isAuthenticated ? "Resume Practice" : "Create Free Account"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                <span className="text-white font-bold">AlgoForge</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The definitive platform for coding interview preparation.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Problems
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    IDE
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4 text-slate-400">
                <a href="https://github.com/hridewelx" target="_blank" className="hover:text-white transition-colors">
                  <SocialIcon platform="github" />
                </a>
                <a href="https://x.com/hridewel" target="_blank" className="hover:text-white transition-colors">
                  <SocialIcon platform="twitter" />
                </a>
                <a href="https://www.linkedin.com/in/hridoychowdhury/" target="_blank" className="hover:text-white transition-colors">
                  <SocialIcon platform="linkedin" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-sm text-slate-600">
            &copy; {new Date().getFullYear()} AlgoForge Inc. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
