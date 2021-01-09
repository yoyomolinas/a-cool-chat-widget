import { isObject } from "@doubco/wtf";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

import en_gb from "dayjs/locale/en-gb";
import tr from "dayjs/locale/tr";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
class Day {
  constructor(props) {
    const en = dayjs.en;

    this.instance = dayjs;

    // console.log("this.localeData", this.localeData);
    this.localeDatas = {
      en,
      en_gb,
    };
    this.localeData = this.localeDatas.en;
  }

  getCurrentLocale() {
    return this.localeData.name;
  }

  day(...args) {
    return this.instance(...args).locale(this.getCurrentLocale());
  }

  format(date, f, options = {}) {
    let format = f;

    if (format) {
      Object.keys(this.localeData.formats).forEach((k) => {
        format = format.replace(new RegExp(k), this.localeData.formats[k]);
      });
    }

    return this.day(date).format(format);
  }

  formatDistance(date, from, options = { isRaw: false }) {
    return this.day(date).from(from, options.isRaw);
  }

  toDate(date, options = {}) {
    let opts = { ...options };

    if (opts.format) {
      Object.keys(this.localeData.formats).forEach((k) => {
        opts.format = opts.format.replace(
          new RegExp(k),
          this.localeData.formats[k]
        );
      });
    }
    // console.log("toDate", this.day(date, opts).toDate());
    return this.day(date, opts).toDate();
  }

  toJSON(date, options = {}) {
    return this.day(date, options).toJSON();
  }

  isValid(date, options = {}) {
    return this.day(date, options).isValid();
  }

  date(date, options = {}) {
    return this.day(date).date();
  }

  diff(date, compared, unit, options = {}) {
    return this.day(date).diff(compared, unit, options.float);
  }

  weekday(date, options = {}) {
    return this.day(date).day();
  }

  month(date, options = {}) {
    return this.day(date).month();
  }

  year(date, options = {}) {
    return this.day(date).year();
  }

  hour(date, options = {}) {
    return this.day(date).hour();
  }

  minute(date, options = {}) {
    return this.day(date).minute();
  }

  daysInMonth(date, options = {}) {
    return this.day(date).daysInMonth();
  }

  set(unit, date, value, options = {}) {
    return this.day(date).set(unit, value);
  }

  add(unit, date, value, options = {}) {
    return this.day(date).add(value, unit);
  }

  subtract(unit, date, value, options = {}) {
    return this.day(date).subtract(value, unit);
  }

  isBetween(date, start, end, options = { type: null }) {
    return this.day(date).isBetween(start, end, options.type);
  }

  getFormat(format, options = {}) {
    return this.localeData.formats[format];
  }

  getLocaleData(locale = this.getCurrentLocale(), options = {}) {
    return this.localeDatas[locale];
  }

  getWeekdays(i) {
    return this.localeData.weekdays[i] || "";
  }

  getWeekdaysShort(i) {
    return this.localeData.weekdaysShort
      ? this.localeData.weekdaysShort[i]
      : this.getWeekdays(i).substr(0, 3);
  }

  getFormatAsArray() {
    let data = this.localeData;
    let date = [];
    let time = ["h", "m"];
    let l = data.formats["L"];
    let lt = data.formats["LT"];
    l = l.toLowerCase().replace(/-/g, ".").replace(/\//g, ".");
    date = l.split(".").map((i) => i.substr(0, 1));

    if (lt.includes("A")) {
      time.push("a");
    }

    return {
      date,
      time,
    };
  }

  createContext(locale) {
    return this.localeDatas[locale];
  }

  registerContext(context) {
    if (context) {
      this.localeData = context;
      this.localeDatas[context.name] = context;
      this.instance.locale(context);
    }
  }

  locale(locale, callback) {
    if (isObject(locale)) {
      this.localeData = locale;
      this.localeDatas[locale.name] = locale;
      this.instance.locale(locale);
      if (callback) callback();
    } else {
      if (this.localeDatas[locale]) {
        this.localeData = this.localeDatas[locale];
        if (callback) callback();
      } else {
        this.localeDatas[locale] = this.localeData;
        this.instance.locale(locale);
        if (callback) callback();
      }
    }
  }
}

export default new Day();
