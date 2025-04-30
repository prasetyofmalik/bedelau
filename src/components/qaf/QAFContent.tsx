import { QAFList } from "./QAFList";

export function QAFContent() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quality Assurance Framework
        </h1>
        <p className="text-xl text-gray-600">
         BPS Kabupaten Siak
        </p>
      </header>

      <div className="mb-8">
        <QAFList />
      </div>
    </div>
  );
}
