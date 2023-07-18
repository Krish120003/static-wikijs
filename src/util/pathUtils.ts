export function normalizeUrl(url: string): string {
  // Remove the ".html" extension from paths ending in "index.html" or "*.html"
  let path = url;
  if (path.endsWith("index.html")) {
    path = path.slice(0, -10); // Remove "index.html" from the end
  } else if (path.endsWith(".html")) {
    path = path.slice(0, -5); // Remove ".html" from the end
  }

  // add the leading "/" from the path
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // remove the trailing "/" from the path
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path ? path : "/";
}

export function findImmediateChildren(
  parent: string,
  paths: string[]
): { to: string; folder: boolean }[] {
  const parentWithSlash =
    normalizeUrl(parent) === "/" ? "/" : normalizeUrl(parent) + "/";
  const immediateChildren = paths
    .map((path) => {
      return path.startsWith(parentWithSlash) ? path : null;
    })
    .filter((path) => path !== null) as string[];

  // count number of slashes in parent
  const numSlashes = parentWithSlash.split("/").length;

  // remove the parent from the beginning of each path, and get just the next level
  const nextLevel = immediateChildren.map((path) => {
    const parentAndChild = path.split("/").splice(0, numSlashes);
    return parentAndChild.join("/");
  });

  // remove duplicates and sort
  const links = [...new Set(nextLevel)].sort();

  // for each link, check if it has an index

  const linksWithFolder = links.map((link) => {
    const isFolder = !paths.includes(link);
    return { to: link, folder: isFolder };
  });

  return linksWithFolder;
}

export function getParent(url: string): string {
  const path = normalizeUrl(url);
  const parts = path.split("/");
  parts.pop();

  return normalizeUrl(parts.join("/"));
}

export function isPage(url: string, paths: string[]): boolean {
  return paths.includes(url);
}

export function isFolder(url: string, paths: string[]): boolean {
  return paths.some((path) => path.startsWith(url + "/"));
}
