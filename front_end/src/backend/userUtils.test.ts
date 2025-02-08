/**
 * In this file, we will test some user utils
 * functions to make sure the axios function work well.
 *
 *
 * Before start:
 *
 * You need to start middle layer server first.
 *
 * Relate to spec:
 *
 * This test relate to spec b, c and d.
 *
 * Reason:
 *
 * This test focuses on correctness verification in the
 * early stages of the REST API being created. We have no experience with these APIs,
 * so testing them is necessary.
 *
 * The test will try to add, delete, and update the user's data.
 * They are all very common database operations.
 * These tests will also tell us if the function of getting user data
 * is implemented correctly. This allows for "cross-validation".
 *
 * Note:
 *
 * This test cannot be used in a production environment,
 * it assumes that the database has only been modified by us.
 *
 * Other:
 *
 * This is the first unit test we wrote,
 * and it below the requirements of the PA section of the assignment.
 *
 * The unit test can be run through methods such as shell or Webstorm (IDE).
 *
 * Create datetime:
 *
 * 21/09/2022
 *
 * Pass status:
 *
 * All Pass.
 */

import {
  deleteUserByUsername,
  getUserByUsernamePassword,
  addNewUserToBackEnd,
  createUserObj,
  getUserByUsername, updateUserToBackEnd
} from "./userUtils";

/**
 * This object is use for our test.
 */
const TEST_USER = createUserObj('TEST1', 'TEST@TEST.com', 'TEST');

// Try to clean up the test user, ignore the error.
beforeAll(async () => {
  try {
    await addNewUserToBackEnd(TEST_USER.username, TEST_USER.email, TEST_USER.password);
  } catch { }
});


/**
 * Clean up test user from backend. Ignore error (If the error not relate to code logic).
 */
afterAll(async () => {
  try {
    await deleteUserByUsername(TEST_USER.username);
  } catch { }
});


test('Test add user to back end.', async () => {
  try {
    await deleteUserByUsername(TEST_USER.username);
  } catch (e) {
    console.log(e);
  }

  // Add user first.
  const retUser = await addNewUserToBackEnd(TEST_USER.username, TEST_USER.email, TEST_USER.password);

  // NOTE: We do not test the password, it was being hashed.
  expect(retUser.username).toMatch(TEST_USER.username);
  expect(retUser.email).toMatch(TEST_USER.email);

  // Also test the create function, the avatar should be null.
  expect(retUser.avatar).toBeNull();
});


test('Test get user by username and password', async () => {
  const user = await getUserByUsernamePassword(TEST_USER.username, TEST_USER.password);

  // User not null.
  expect(user).not.toBeNull()

  // Check each field.
  expect(user.username).toMatch(TEST_USER.username);
  expect(user.email).toMatch(TEST_USER.email);
  expect(user.avatar).toBeNull();
});


test('Test get user just by username', async () => {
  const user = await getUserByUsername(TEST_USER.username);

  // User not null.
  expect(user).not.toBeNull()

  // Check each field.
  expect(user.username).toMatch(TEST_USER.username);
  expect(user.email).toMatch(TEST_USER.email);
  expect(user.avatar).toBeNull();
});


const DUPLICATE_USER = createUserObj('TEST11', 'TEST@TEST.com2', 'TEST2');
const UPDATE_USER = createUserObj('TEST111', 'TEST@TEST.com1', 'TEST1');

/**
 * A series of tests to ensure that the update feature is implemented correctly.
 */
describe('Test update user async function.', () => {

  const NEW_PASSWORD = `${TEST_USER.password}123456789`;
  const NEW_EMAIL = `${TEST_USER.email}cococo`;

  test('Test update username success', async () => {
    await updateUserToBackEnd(TEST_USER, { username: UPDATE_USER.username });

    const user = await getUserByUsername(UPDATE_USER.username);
    expect(user.username).toMatch(UPDATE_USER.username);

    await deleteUserByUsername(UPDATE_USER.username);
    await addNewUserToBackEnd(TEST_USER.username, TEST_USER.email, TEST_USER.password);
  });

  // If username duplicate, the update should fail.
  test('Test update username duplicate failed', async () => {
    await addNewUserToBackEnd(DUPLICATE_USER.username, DUPLICATE_USER.email, DUPLICATE_USER.password);

    await expect(async () => await updateUserToBackEnd(
      TEST_USER, { username: DUPLICATE_USER.username })
    ).rejects.toThrow(Error);

    await deleteUserByUsername(DUPLICATE_USER.username);
  });

  // Normal password update.
  test('Test update password', async () => {
    await updateUserToBackEnd(TEST_USER, { password: NEW_PASSWORD });

    const user = await getUserByUsername(TEST_USER.username);
    expect(user.password).not.toBeNull();

    await updateUserToBackEnd(TEST_USER, { password: TEST_USER.password });
  });

  // Also normal email update.
  test('Test update email', async () => {
    await updateUserToBackEnd(TEST_USER, { email: NEW_EMAIL });

    const user = await getUserByUsername(TEST_USER.username);
    expect(user.email).toMatch(NEW_EMAIL);

    await updateUserToBackEnd(TEST_USER, {  email: NEW_EMAIL });
  });
});

// Delete user by user obj.
test('Test delete user.', async () => {
  await deleteUserByUsername(TEST_USER.username);
  await expect(async () => await getUserByUsername(TEST_USER.username)).rejects.toThrow(Error);
});
