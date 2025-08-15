import { Link } from "react-router";

type NavLinkProps = {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function NavLink({ to, isActive, children }: NavLinkProps) {
  return (
    <span className="nav-item">
      {isActive ? <span className="active-link">{children}</span> : <Link to={to}>{children}</Link>}
    </span>
  );
}
