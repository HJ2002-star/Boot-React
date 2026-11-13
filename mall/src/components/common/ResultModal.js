const ResultModal = ({ title, content, callbackFn }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md m-4 text-center">
      <h2 id="result-title" className="text-2xl font-bold mb-6">{title}</h2>
      <p className="mb-6">{content}</p>
      <button type="button" autoFocus className="bg-blue-500 text-white rounded px-8 py-3" onClick={callbackFn}>확인</button>
    </div>
  </div>
)
export default ResultModal
