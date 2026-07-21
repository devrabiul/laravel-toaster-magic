import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAV_SECTIONS } from "../data/routes";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        className={`sidebar__scrim${open ? " open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`sidebar${open ? " open" : ""}`}
        aria-label="Documentation"
        id="sidebar-nav"
      >
        {NAV_SECTIONS.map((section) => (
          <div className="sidebar__section" key={section.title}>
            <div className="sidebar__title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
              >
                {item.label ?? item.title}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
