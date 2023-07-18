import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  normalizeUrl,
  isPage,
  isFolder,
  findImmediateChildren,
  getParent,
} from "~/util/pathUtils";
import Link from "next/link";

interface NavLinkProps {
  to: string;
  content: string;
  updator?: (to: string) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, updator, content }) => {
  if (updator === undefined) {
    return (
      <Link
        className="block w-full p-4 text-left hover:bg-neutral-100"
        href={to}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className="block w-full p-4 text-left hover:bg-neutral-100"
      onClick={() => {
        updator(to);
      }}
    >
      {content}
    </button>
  );
};

interface NavProps {
  paths: {
    path: string;
    title: string;
    id: number;
  }[];
}

const Navbar: React.FC<NavProps> = (props) => {
  const router = useRouter();
  const [navPath, setNavPath] = useState<string>(
    normalizeUrl(
      Array.isArray(router.query.path)
        ? router.query.path.join("/")
        : router.query.path || ""
    )
  );

  useEffect(() => {
    setNavPath(
      normalizeUrl(
        Array.isArray(router.query.path)
          ? router.query.path.join("/")
          : router.query.path || ""
      )
    );
  }, [router.query.path]);

  const pagePaths = props.paths.map((e) => normalizeUrl(e.path));

  let children = [];

  if (isPage(navPath, pagePaths) && !isFolder(navPath, pagePaths)) {
    children = findImmediateChildren(getParent(navPath), pagePaths);
  } else {
    children = findImmediateChildren(navPath, pagePaths);
  }

  // match all the children with a title from the pages array
  const childrenWithTitles = children.map((child) => {
    const page = props.paths.find(
      (page) => normalizeUrl(page.path) === child.to
    );
    if (page === undefined) {
      return { ...child, title: child.to };
    }
    return { ...child, title: page.title };
  });

  return (
    <aside className="max-h-screen overflow-scroll">
      <ul>
        <li>
          <NavLink
            to={getParent(navPath)}
            updator={setNavPath}
            content={"Back to " + getParent(navPath)}
          />
        </li>
        {childrenWithTitles.map((child) => {
          console.log(child);
          return (
            <li className="block" key={child.to}>
              <NavLink
                to={child.to}
                updator={child.folder ? setNavPath : undefined}
                content={child.title}
              />
            </li>
          );
        })}
      </ul>
      <div className="bg-red-500">
        <p>Current path: {navPath}</p>
      </div>
    </aside>
  );
};

export default Navbar;
