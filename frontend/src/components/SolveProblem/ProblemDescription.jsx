const ProblemDescription = ({ problem, getDifficultyColor }) => {
  return (
    <div className="p-6 text-slate-300">
      <div className="prose prose-invert max-w-none">
        {/* Problem Title and Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-white leading-tight">{problem.title}</h1>
            <span className={`px-2 py-0.5 border rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {problem.tags?.map((tag, index) => (
              <div key={index} className="px-2 py-0.5 bg-slate-700/50 border border-slate-600/50 rounded text-slate-400 text-xs font-medium">
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-base leading-relaxed whitespace-pre-line">{problem.description}</p>
        </div>

        {/* Examples */}
        <Examples problem={problem} />
        
        {/* Constraints */}
        <Constraints problem={problem} />
      </div>
    </div>
  );
};

const Examples = ({ problem }) => (
  <div className="mb-6 space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4">Examples</h3>
    {problem.visibleTestCases?.map((testCase, index) => (
      <ExampleCard key={testCase._id} testCase={testCase} index={index} />
    ))}
  </div>
);

const ExampleCard = ({ testCase, index }) => (
  <div className="space-y-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
    <p className="text-white font-semibold mb-2">Example {index + 1}:</p>
    <TestCaseInputOutput testCase={testCase} />
    {testCase.explanation && <Explanation explanation={testCase.explanation} />}
  </div>
);

const TestCaseInputOutput = ({ testCase }) => (
  <>
    <div>
      <p className="text-slate-400 font-medium text-sm mb-1">Input:</p>
      <pre className="bg-slate-900 p-3 rounded-lg text-sm text-slate-200 border border-slate-700/50">{testCase.input}</pre>
    </div>
    <div>
      <p className="text-slate-400 font-medium text-sm mb-1">Output:</p>
      <pre className="bg-slate-900 p-3 rounded-lg text-sm text-slate-200 border border-slate-700/50">{testCase.output}</pre>
    </div>
  </>
);

const Explanation = ({ explanation }) => (
  <div>
    <p className="text-slate-400 font-medium text-sm mb-1">Explanation:</p>
    <p className="text-slate-300 text-sm break-words">{explanation}</p>
  </div>
);

const Constraints = ({ problem }) => (
  problem.constraints && problem.constraints.length > 0 && (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Constraints</h3>
      <ul className="list-disc list-inside space-y-1 text-slate-300 pl-4">
        {problem.constraints.map((constraint, index) => (
          <li key={index} className="text-sm">{constraint}</li>
        ))}
      </ul>
    </div>
  )
);

export default ProblemDescription;