// The MIT License (MIT)
//
// Copyright (c) 2014 Jason Quense
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial
// portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Include this license is because the EMAIL_REGEX is copy from Yup's source code.
// The Yup github repository is https://github.com/jquense/yup.

// Regex is not by me. The eslint comment is used to avoid static checking error.
export const EMAIL_REGEX =
  // eslint-disable-next-line
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

// We first check if letter, number, special character occur. And then, we check the whole password.
// At least 8 characters.
// Support special character: !@#$%/^&*()_+=?;'.,
// Note: JS does not need to use '\/' for '/'. When using regex101, it will give you an error.
export const PASSWORD_REGEX
  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%/^&*()_+=?;'.,])[A-Za-z\d!@#$%/^&*()_+=?;'.,]{8,}$/;

export function isEmail(str: string) {
  return EMAIL_REGEX.test(str);
}

export function isCorrectPassword(str: string) {
  // return str.length !== 0;
  return PASSWORD_REGEX.test(str);
}

/**
 * Check if a string is url.
 * @param str
 */
export function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function verifyPostAndReply(str: string, maxLength: number): true | string {
  const newStr = str.trim();
  if (newStr.length === 0) {
    return 'Value cannot be empty or blank.';
  }

  if (maxLength > 0 && newStr.length > maxLength) {
    return `Text more than ${maxLength} characters is not allow.`;
  }

  return true;
}

export function isValidPostAndReplyValue(str: string, maxLength: number = 600): true | string {
  // NOTE: The regex is copy from RMIT Further Web Programming Week 8 example code. (Pra and Ltl)
  const newStr = str.replace(/<(.|\n)*?>/g, "");
  return verifyPostAndReply(newStr, maxLength);
}

/**
 * Invoke function, if the function return false, return msg.
 * Otherwise, return true.
 *
 * @param fun A function return boolean value.
 * @param msg Error message need to return.
 * @returns {*|boolean} If function return true, return ture. Otherwise, return msg.
 */
export function isValidMsg(fun: () => any, msg: string): string | boolean {
  return fun() ? true : msg;
}
