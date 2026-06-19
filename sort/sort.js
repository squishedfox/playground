import assert from "assert";

/**
 * Creates a new object with the changed sort. the oritinal obj will be untouched.
 * @public
 * @method sort
 * @param {string} the key in the object to re sort
 * @param {number} newOrdinal the new place in the object the value should go
 * @param {string} object to reorder
 * @returns {object} updated sort object
 * @throws {Error} new ordinal out of range
 * @throws {Error} new orderinal is negative
 */
function sort(propName, newOrdinal, obj) {
  if (newOrdinal > Object.keys(obj).length) {
    throw new Error(
      `newOrdinal out of range. Expected between 0 and ${Object.keys(obj).length}`,
    );
  }
  if (newOrdinal < 0) {
    throw new Error("Ordinal cannot be negative");
  }

  let newObj = {};
  const propertyNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propertyNames.length; ++i) {
    const prop = propertyNames[i];
    if (i === newOrdinal) {
      if (i !== 0) {
        newObj[prop] = obj[prop]; // we need to push this on first;
      }
      newObj[propName] = obj[propName];
      if (i === 0) {
        newObj[prop] = obj[prop]; // we need to make sure this gets pushed after
      }
    } else if (prop !== propName) {
      newObj[prop] = obj[prop];
    }
  }

  return newObj;
}

function test_object_will_reorder_second_item_to_fourth_item() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("b", 3, obj);
  // assert
  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        a: "first",
        c: "third",
        d: "fourth",
        b: "second",
        e: "fifth",
        f: "sixth",
      }),
  );
}

function test_object_will_reorder_first_item_to_second_item() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("a", 1, obj);

  // assert
  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        b: "second",
        a: "first",
        c: "third",
        d: "fourth",
        e: "fifth",
        f: "sixth",
      }),
  );
}

function test_object_will_reorder_second_item_to_first_item() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("b", 0, obj);
  // assert
  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        b: "second",
        a: "first",
        c: "third",
        d: "fourth",
        e: "fifth",
        f: "sixth",
      }),
  );
}

function test_object_will_reorder_last_to_first() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("f", 0, obj);

  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        f: "sixth",
        a: "first",
        b: "second",
        c: "third",
        d: "fourth",
        e: "fifth",
      }),
  );
}

function test_object_will_reorder_first_to_last() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("a", Object.keys(obj).length - 1, obj);

  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        b: "second",
        c: "third",
        d: "fourth",
        e: "fifth",
        f: "sixth",
        a: "first",
      }),
  );
}

function test_object_should_not_reorder_one_property() {
  // arrange
  const obj = {
    a: "first",
  };

  // act
  const newObj = sort("a", Object.keys(obj).length - 1, obj);

  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        a: "first",
      }),
  );
}

function test_should_not_reorder_non_existant_proprty() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
    d: "fourth",
    e: "fifth",
    f: "sixth",
  };

  // act
  const newObj = sort("g", Object.keys(obj).length - 1, obj);

  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        a: "first",
        b: "second",
        c: "third",
        d: "fourth",
        e: "fifth",
        f: "sixth",
      }),
  );
}

(function () {
  test_object_will_reorder_second_item_to_fourth_item();
  test_object_will_reorder_first_item_to_second_item();
  test_object_will_reorder_second_item_to_first_item();
  test_object_will_reorder_last_to_first();
  test_object_will_reorder_first_to_last();
  test_object_should_not_reorder_one_property();
  test_should_not_reorder_non_existant_proprty();
})();
