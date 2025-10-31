import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, setLanguage, code, setCode, splitY }) => {
  return (
    <div className="flex flex-col border-b border-slate-700/50 min-h-0" style={{ height: `${splitY}%` }}>
      <EditorHeader language={language} setLanguage={setLanguage} />
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "off",
          }}
        />
      </div>
    </div>
  );
};

const EditorHeader = ({ language, setLanguage }) => (
  <div className="flex items-center justify-between p-2 bg-slate-800/70 border-b border-slate-700/50 flex-shrink-0">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-white">Code</span>
      <LanguageSelector language={language} setLanguage={setLanguage} />
    </div>
    <EditorSettings />
  </div>
);

const LanguageSelector = ({ language, setLanguage }) => (
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    <option value="c">C</option>
    <option value="cpp">C++</option>
    <option value="java">Java</option>
    <option value="python">Python3</option>
    <option value="javascript">JavaScript</option>
    <option value="typescript" disabled>TypeScript</option>
    <option value="rust" disabled>Rust</option>
  </select>
);

const EditorSettings = () => (
  <div className="flex items-center gap-3 text-slate-400">
    <button title="Settings" className="hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.44a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  </div>
);

export default CodeEditor;