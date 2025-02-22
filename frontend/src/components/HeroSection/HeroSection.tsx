import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
function HeroSection() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col">
      {/* heading */}
      <div>
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Welcome to our</span>{" "}
          <span className="block text-indigo-600 xl:inline">Restaurant</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Discover our delicious menu and order your favorite dishes online.
        </p>
      </div>
      {/* button */}
      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
        <div className="rounded-md shadow">
          <Link
            to="/menu"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            View Menu
          </Link>
        </div>
        {!isAuthenticated && (
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link
              to="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroSection;
