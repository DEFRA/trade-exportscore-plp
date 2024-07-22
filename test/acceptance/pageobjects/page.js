import { browser } from "@wdio/globals";

export default class Page {
  open(path) {
    browser.url(path);
  }
}
