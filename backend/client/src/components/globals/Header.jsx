import { Link, NavLink } from 'react-router';

function Header() {
    return (
      <header className="bg-gray-200">
        <div className="px-10">
          <nav className="flex items-center gap-4 justify-end">
            {/* NavLink makes it easy to show active states */}
            <NavLink
              to="/"
              className={`py-5 ${({ isActive }) => (isActive ? 'active' : '')}`}
            >
              Home
            </NavLink>

            <Link to="/faqs">Faqs</Link>
          </nav>
        </div>
      </header>
    );
}

export default Header;