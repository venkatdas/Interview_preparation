/**
 * 05. Design In-Memory File System (lite)   (LeetCode 588 — Hard)
 *
 * PROBLEM
 * Implement a tiny file system:
 *   - ls(path): if path is a file, return [fileName]; if a directory, return the names of
 *     its files and sub-directories in LEXICOGRAPHIC order
 *   - mkdir(path): create the directory and every missing parent
 *   - addContentToFile(path, content): create the file if needed, APPEND content
 *   - readContentFromFile(path): return the content
 * Paths are absolute, start with "/", and "/" is the root.
 *
 * EXAMPLES
 * ls("/") -> []
 * mkdir("/a/b/c"); addContentToFile("/a/b/c/d", "hello"); ls("/") -> ["a"]
 * readContentFromFile("/a/b/c/d") -> "hello"; ls("/a/b/c") -> ["d"]; ls("/a/b/c/d") -> ["d"]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Names are lowercase letters; paths have no trailing slash except root
 * - Can a file and a directory have the same name in one folder? (assume no)
 * - Must ls be sorted? (yes)
 *
 * APPROACH 1 — Brute force   O(total paths) per op
 * Keep a Map of full path -> {isFile, content}. ls("/a") = scan every key, keep those whose
 * parent is "/a", take the next segment, dedupe and sort. mkdir inserts every prefix.
 *
 * APPROACH 2 — Optimal (Trie of path segments)   O(path length) per op (+ sort for ls)
 * Each node = { children: Map name -> node, isFile, content }. Walking a path means
 * following one child per segment. This is a trie (../../../22_Tries/) whose "characters"
 * are folder names.
 *   mkdir: walk, creating missing children
 *   addContentToFile: walk creating, mark the last node as a file, append
 *   ls: walk; if file -> [lastSegment]; else sorted keys of children
 *
 * Dry run: mkdir("/a/b/c")
 *   root.children: {} -> create a -> a.children create b -> b.children create c
 *   addContentToFile("/a/b/c/d", "hello"): walk a,b,c; create d; d.isFile = true; d.content = "hello"
 *   ls("/a/b/c") -> keys of c.children = ["d"]
 *   ls("/a/b/c/d") -> d is a file -> ["d"]
 *
 * EDGE CASES
 * - ls("/") on an empty system -> []
 * - appending twice concatenates
 * - mkdir of an existing directory is a no-op
 * - ls on a file returns the file name, not the full path
 */

function splitPath(path) {
  return path.split('/').filter((segment) => segment.length > 0);
}

class FileSystemBrute {
  constructor() {
    this.entries = new Map(); // full path (no trailing slash, root = "") -> {isFile, content}
    this.entries.set('', { isFile: false, content: '' });
  }
  #ensureDirs(segments) {
    let current = '';
    for (const seg of segments) {
      current += '/' + seg;
      if (!this.entries.has(current)) this.entries.set(current, { isFile: false, content: '' });
    }
  }
  mkdir(path) {
    this.#ensureDirs(splitPath(path));
  }
  addContentToFile(path, content) {
    const segments = splitPath(path);
    this.#ensureDirs(segments.slice(0, -1));
    const full = '/' + segments.join('/');
    if (!this.entries.has(full)) this.entries.set(full, { isFile: true, content: '' });
    this.entries.get(full).content += content;
  }
  readContentFromFile(path) {
    return this.entries.get(path).content;
  }
  ls(path) {
    const segments = splitPath(path);
    const full = segments.length ? '/' + segments.join('/') : '';
    const entry = this.entries.get(full);
    if (entry.isFile) return [segments[segments.length - 1]];
    const names = new Set();
    for (const key of this.entries.keys()) {
      if (key.length > full.length && key.startsWith(full + '/')) {
        names.add(key.slice(full.length + 1).split('/')[0]);
      }
    }
    return [...names].sort();
  }
}

class FileSystem {
  constructor() {
    this.root = { children: new Map(), isFile: false, content: '' };
  }

  // walk the path, creating nodes when `create` is true
  #walk(path, create) {
    let node = this.root;
    for (const seg of splitPath(path)) {
      if (!node.children.has(seg)) {
        if (!create) return null;
        node.children.set(seg, { children: new Map(), isFile: false, content: '' });
      }
      node = node.children.get(seg);
    }
    return node;
  }

  ls(path) {
    const node = this.#walk(path, false);
    if (!node) return [];
    if (node.isFile) {
      const segments = splitPath(path);
      return [segments[segments.length - 1]];
    }
    return [...node.children.keys()].sort();
  }

  mkdir(path) {
    this.#walk(path, true);
  }

  addContentToFile(path, content) {
    const node = this.#walk(path, true);
    node.isFile = true;
    node.content += content;
  }

  readContentFromFile(path) {
    return this.#walk(path, false).content;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [FileSystemBrute, FileSystem]) {
  const fs = new Cls();
  assert.deepStrictEqual(fs.ls('/'), []);
  fs.mkdir('/a/b/c');
  fs.addContentToFile('/a/b/c/d', 'hello');
  assert.deepStrictEqual(fs.ls('/'), ['a']);
  assert.strictEqual(fs.readContentFromFile('/a/b/c/d'), 'hello');
  assert.deepStrictEqual(fs.ls('/a/b/c'), ['d']);
  assert.deepStrictEqual(fs.ls('/a/b/c/d'), ['d']);
  fs.addContentToFile('/a/b/c/d', ' world');
  assert.strictEqual(fs.readContentFromFile('/a/b/c/d'), 'hello world');
  fs.mkdir('/a/zz');
  fs.mkdir('/a/aa');
  fs.mkdir('/a/b');                        // existing: no-op
  assert.deepStrictEqual(fs.ls('/a'), ['aa', 'b', 'zz']);
  fs.addContentToFile('/top.txt', 'x');
  assert.deepStrictEqual(fs.ls('/'), ['a', 'top.txt']);
}
console.log('✓ 05-design-in-memory-file-system passed');

module.exports = { FileSystem, FileSystemBrute, optimal: FileSystem, bruteForce: FileSystemBrute };
