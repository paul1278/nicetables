const assert = require("assert");
const NiceTable = require("../");

const table = new NiceTable();
let output = "";
table.outputWriter = (str) => (output += str.replace(/\n/g, ""));

describe("NiceTable", function () {
  describe("#setLinesPerRow(i)", function () {
    it("should throw when value is negative", function () {
      assert.throws(() => table.setLinesPerRow(-1));
    });
    it("should throw when value is not an integer", function () {
      assert.throws(() => table.setLinesPerRow(2.1));
    });
    it("should return instance when everything is good", function () {
      assert.ok(table.setLinesPerRow(2) === table);
    });
  });

  describe("#setDimensions(...dimensions)", function () {
    it("should throw when dimensions sum up to over 1", function () {
      assert.throws(() => table.setDimensions(0.9, 0.2));
    });
    it("should work when every parameter is passed correctly", function () {
      table.setDimensions(0.8, 0.2);
      assert.deepStrictEqual([0.8, 0.2], table.dimensions);
    });
  });

  describe("#setTitles(...titles)", function () {
    it("should convert not strings to strings", function () {
      table.setTitles([], "test");
      assert.deepStrictEqual(["", "test"], table.titles);
    });
    it("should accept no titles", function () {
      table.setTitles();
      assert.deepStrictEqual([], table.titles);
    });
  });

  describe("#addRow(...data)", function () {
    it("should convert not strings to strings", function () {
      table.addRow([], "test");
      assert.deepStrictEqual(["", "test"], table.rows[0]);
    });
  });

  describe("#print()", function () {
    it("should output a correct table", function () {
      table.fixedWidth = 80;
      output = "";
      table.print();
      assert.strictEqual(
        output,
        `|=============================================================+================||Col                                                          |Col             ||=============================================================+================||                                                             |test            ||-------------------------------------------------------------+----------------|`
      );
    });
    it("should output a correct table with given titles and fill up the rest with defaults", function () {
      table.setTitles("test");
      output = "";
      table.print();
      assert.strictEqual(
        output,
        `|=============================================================+================||test                                                         |Col             ||=============================================================+================||                                                             |test            ||-------------------------------------------------------------+----------------|`
      );
    });
    it("should output a correct table with default dimensions", function () {
      table.setDimensions();
      output = "";
      table.print();
      assert.strictEqual(
        output,
        `|======================================+=======================================||test                                  |Col                                    ||======================================+=======================================||                                      |test                                   ||--------------------------------------+---------------------------------------|`
      );
    });
    it("should output a correct table with default dimensions but one is given", function () {
      table.setDimensions(0.5);
      output = "";
      table.print();
      assert.strictEqual(
        output,
        `|======================================+=======================================||test                                  |Col                                    ||======================================+=======================================||                                      |test                                   ||--------------------------------------+---------------------------------------|`
      );
    });
    it("should trim after two lines", function () {
      output = "";
      table.addRow(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores test"
      );
      table.print();
      assert.strictEqual(
        output,
        `|======================================+=======================================||test                                  |Col                                    ||======================================+=======================================||                                      |test                                   ||--------------------------------------+---------------------------------------||Lorem ipsum dolor sit amet, consetetur|                                       || sadipscing elitr, sed diam nonumy ...|                                       ||--------------------------------------+---------------------------------------|`
      );
    });
    it("print without fixed width", function () {
      output = "";
      table.fixedWidth = -1;
      table.print();
      assert.ok(
        output.match(/\|[\=]+\+[\=]+\|/)[0].length === process.stdout.columns
      );
    });
  });
});
