import assert from "assert";

/**
 * Creates a new object with the changed sort. the original obj will be untouched.
 * @public
 * @method sort
 * @param {string} the key in the object to re sort
 * @param {number} newOrdinal the new place in the object the value should go
 * @param {string} object to reorder
 * @returns {object} updated sort object
 * @throws {Error} new ordinal out of range
 * @throws {Error} new ordinal is negative
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

  const propertyNames = Object.getOwnPropertyNames(obj);

  const newObj = {};
  let inserted = false;
  let writeIndex = 0;

  for (let i = 0; i < propertyNames.length; ++i) {
    const prop = propertyNames[i];
    if (prop === propName) {
      continue;
    }

    if (!inserted && writeIndex === newOrdinal) {
      Object.defineProperty(newObj, propName, {
        value: obj[propName],
        enumerable: true,
        writable: true,
      });

      inserted = true;
      ++writeIndex;
    }

    Object.defineProperty(newObj, prop, {
      value: obj[prop],
      enumerable: true,
      writable: true,
    });

    ++writeIndex;
  }

  if (!inserted) {
    Object.defineProperty(newObj, propName, {
      value: obj[propName],
      enumerable: true,
      writable: true,
    });
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

function test_should_not_reorder_non_existent_proprty() {
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

function test_should_reorder_last_option_when_there_are_three() {
  // arrange
  const obj = {
    a: "first",
    b: "second",
    c: "third",
  };

  // act
  const newObj = sort("c", 1, obj);

  assert(
    JSON.stringify(newObj) ===
      JSON.stringify({
        a: "first",
        c: "third",
        b: "second",
      }),
  );
}

/**
 * Calls a function and console logs pass or fail
 * @param {(function(): void|Promise<void>)} func  function to call
 * @returns {void}
 */
function assertWrapper(func) {
  const funcName = func.prototype.constructor.name;
  try {
    func();
    console.log(`✅ ${funcName} passed`);
  } catch (err) {
    console.log(`❌ ${funcName} failed`);
  }
}

function test_func() {
  console.log("hello world");
}

(function () {
  const testArr = [
    test_object_will_reorder_second_item_to_fourth_item,
    test_object_will_reorder_first_item_to_second_item,
    test_object_will_reorder_second_item_to_first_item,
    test_object_will_reorder_last_to_first,
    test_object_will_reorder_first_to_last,
    test_object_should_not_reorder_one_property,
    test_should_not_reorder_non_existent_proprty,
    test_should_reorder_last_option_when_there_are_three,
  ];

  for (const test of testArr) {
    assertWrapper(test);
  }
})();
