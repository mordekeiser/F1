export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-red-600 text-2xl font-bold">
          F1 NEXUS
        </h1>

        <div className="flex gap-6 text-white">
          <a href="#schedule">Schedule</a>
          <a href="#drivers">Drivers</a>
          <a href="#teams">Teams</a>
          <a href="#circuits">Circuits</a>
        </div>
      </div>
    </nav>
  );
}