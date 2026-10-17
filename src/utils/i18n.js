// src/utils/i18n.js
import faJson from '../locales/fa.json';

const dictionaries = {
  fa: faJson
};

// زبان پیش‌فرض
let currentLocale = 'fa';

export function t(path) {
  const keys = path.split('.');
  let value = dictionaries[currentLocale];
  
  for (const key of keys) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      return path; // اگر کلید پیدا نشد، خود کلید را برمی‌گرداند تا گم نشود
    }
  }
  return value;
}
