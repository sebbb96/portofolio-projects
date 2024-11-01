import { SearchInput } from '@/components/Search/SearchInput';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '@/store/slices/searchSlice';

const links = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Edit Projects',
    to: '/editprojects',
  },
];

function Root() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');

  const handleSearch = (term: string) => {
    if (location.pathname === '/' || location.pathname === '/editprojects') {
      dispatch(setSearchTerm(term));
    }
  };

  // Hide search on routes where it's not needed
  useEffect(() => {
    setSearchVisible(
      (location.pathname === '/' || location.pathname === '/editprojects') &&
        activeTab !== 'createproject'
    );
  }, [location, activeTab]);

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://sebastian-webdev.vercel.app"
            target="_blank"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Project Manager
            </span>
          </a>
          <div className="flex items-center md:order-2">
            <div
              className={`${searchVisible ? 'block' : 'invisible'} w-[200px] lg:w-[300px]`}
            >
              <SearchInput
                onSearch={handleSearch}
                placeholder={`Search ${location.pathname === '/editprojects' ? 'all' : 'visible'} projects...`}
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      location.pathname === link.to
                        ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                        : 'block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
