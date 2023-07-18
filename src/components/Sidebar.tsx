import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  normalizeUrl,
  isPage,
  isFolder,
  findImmediateChildren,
  getParent,
} from "~/util/pathUtils";

interface NavLinkProps {
  to: string;
  content: string;
  updator?: (to: string) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, updator, content }) => {
  if (updator === undefined) {
    return (
      <a className="block w-full text-left" href={`${to}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      className="block w-full text-left"
      onClick={() => {
        updator(to);
      }}
    >
      {content}
    </button>
  );
};

interface NavProps {
  paths: string[];
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

  const pagePaths = props.paths.map((e) => normalizeUrl(e.path));

  let children = [];

  console.log(isPage(navPath, pagePaths), isFolder(navPath, pagePaths));

  if (isPage(navPath, pagePaths) && !isFolder(navPath, pagePaths)) {
    console.log("Using parent!");
    children = findImmediateChildren(getParent(navPath), pagePaths);
  } else {
    console.log("Using child!");
    children = findImmediateChildren(navPath, pagePaths);
  }

  console.log("Currently on", navPath);
  console.log("Children", children);
  console.log("Parent", getParent(navPath));

  // match all the children with a title from the pages array
  const childrenWithTitles = children.map((child) => {
    const page = props.paths.find((page) => page.path === child.to);
    if (page === undefined) {
      return { ...child, title: child.to };
    }
    return { ...child, title: page.title };
  });

  return (
    <aside className="max-h-screen overflow-scroll p-4">
      <ul>
        <li>
          <NavLink
            to={getParent(navPath)}
            updator={setNavPath}
            content={getParent(navPath)}
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
