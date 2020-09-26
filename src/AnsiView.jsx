// Derived from ansi-to-react by nteract
// https://github.com/nteract/nteract/blob/master/packages/ansi-to-react/README.md
// Originally released under the BSD 3-Clause License

import * as React from "react";
import { ansiToJson } from "anser";
import { escapeCarriageReturn } from "escape-carriage";

const LINK_REGEX = /(https?:\/\/(?:www\.|(?!www))[^\s.]+.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

/**
 * Converts ANSI strings into JSON output.
 * @name ansiToJSON
 * @function
 * @param {String} input The input string.
 * @return {Array} The parsed input.
 */
function ansiToJSON(input) {
  input = escapeCarriageReturn(input);
  return ansiToJson(input, {
    json: true,
    remove_empty: true,
    use_classes: true,
  });
}

/**
 * Converts an Anser bundle into a React Node.
 * @param linkify whether links should be converting into clickable anchor tags.
 * @param bundle Anser output.
 */
function convertBundleIntoReact(linkify, bundle, key) {

  if (!linkify) {
    return React.createElement("span", { className: `${bundle.fg || ''} ${bundle.bg || ''}`, key }, bundle.content);
  }

  const words = bundle.content.split(" ").reduce(
    (words, word, index) => {
      // If this isn't the first word, re-add the space removed from split.
      if (index !== 0) {
        words.push(" ");
      }

      // If  this isn't a link, just return the word as-is.
      if (!LINK_REGEX.test(word)) {
        words.push(word);
        return words;
      }

      words.push(
        React.createElement(
          "a",
          {
            key: index,
            href: word,
            target: "_blank"
          },
          `${word}`
        )
      );
      return words;
    },
    []
  );
  return React.createElement("span", { className: `${bundle.fg} ${bundle.bg}`, key }, words);
}

export default function Ansi(props) {
  return React.createElement(
    "code",
    { className: props.className },
    ansiToJSON(props.children).map(
      convertBundleIntoReact.bind(null, props.linkify)
    )
  );
}
