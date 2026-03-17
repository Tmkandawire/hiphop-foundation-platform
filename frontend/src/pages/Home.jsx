import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <section className="hero bg-base-200 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4">HipHop Foundation</h1>
          <p className="mb-6 text-lg">
            Empowering communities through music, education, and charity.
          </p>
          <Link to="/donate" className="btn btn-primary mr-4">
            Donate Now
          </Link>
          <Link to="/merch" className="btn btn-outline">
            Shop Merchandise
          </Link>
        </div>
      </section>
    </div>
  );
}
