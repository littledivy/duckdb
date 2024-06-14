import { describe, it } from "std/testing/bdd.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

import { open } from "../mod.ts";

function runSQL(sql: string) {
  const db = open(":memory:");
  const connection = db.connect();
  const res = connection.query(sql);
  return res;
}

describe.skip("Bitstring Type", () => {
  it("should create a bitstring", () => {
    const res = runSQL(`SELECT '101010'::BIT;`);
    console.log(res);
  });
  it("should create a bitstring with predefined length", () => {
    const res = runSQL(`SELECT bitstring('0101011', 12);`);
    console.log(res);
  });
});

describe.skip("Blob Type", () => {
  it("should create a blob value with a single byte (170)", () => {
    const res = runSQL(`ELECT '\xAA'::BLOB AS b;`);
    console.log(res);
  });
  it("should create a blob value with three bytes (170, 171, 172)", () => {
    const res = runSQL(`SELECT '\\xAA\\xAB\\xAC'::BLOB;`);
    console.log(res);
  });
  it("should create a blob value with two bytes (65, 66)", () => {
    const res = runSQL(`SELECT 'AB'::BLOB as b;`);
    console.log(res);
  });
});

describe("Boolean Type", () => {
  it("should select the three possible values of a boolean column", () => {
    const res = runSQL(`SELECT TRUE, FALSE, NULL::BOOLEAN;`);
    assertEquals(Object.values(res[0]), [1, 0, 0]);
  });

  it("should should create booleans as a result of comparisons", () => {
    const res = runSQL(`
      CREATE TABLE integers(i INTEGER);
      INSERT INTO integers VALUES (5), (15), (NULL);
      SELECT * FROM integers WHERE i > 10;
    `);
    assertEquals(res.length, 1);
    assertEquals(res[0].i, 15);
  });
});

describe("Date Type", () => {
  it("should create a date", () => {
    const res = runSQL(`SELECT DATE '1992-09-20' AS date;`);
    assertEquals(res[0].date, Date.parse("1992-09-20"));
  });

  it("should support epoch date", () => {
    const res = runSQL(`SELECT 'epoch'::DATE AS date;`);
    assertEquals(res[0].date, Date.parse("1970-01-01"));
  });
});

describe("Numeric Types", () => {
  describe("Integer Types", () => {
    it("should support TINYINT", () => {
      const res = runSQL(`SELECT 10::TINYINT AS TINYINT;`);
      assertEquals(res[0].TINYINT, 10);
    });
    it("should overflow TINYINT", () => {
      const test = () => runSQL(`SELECT 1000::TINYINT AS TINYINT;`);
      assertThrows(test, Error, "Conversion Error");
    });

    it("should support SMALLINT", () => {
      const res = runSQL(`SELECT 10000::SMALLINT AS SMALLINT;`);
      assertEquals(res[0].SMALLINT, 10000);
    });
    it("should overflow SMALLINT", () => {
      const test = () => runSQL(`SELECT 100000::SMALLINT AS SMALLINT;`);
      assertThrows(test, Error, "Conversion Error");
    });

    it("should support INTEGER", () => {
      const res = runSQL(`SELECT 1000000000::INTEGER AS INTEGER;`);
      assertEquals(res[0].INTEGER, 1000000000);
    });
    it("should overflow INTEGER", () => {
      const test = () => runSQL(`SELECT 100000000000000::INTEGER AS INTEGER;`);
      assertThrows(test, Error, "Conversion Error");
    });

    it("should support BIGINT", () => {
      const res = runSQL(`SELECT 100000000000000::BIGINT AS BIGINT;`);
      assertEquals(res[0].BIGINT, 100000000000000n);
    });
    it("should overflow BIGINT", () => {
      const test = () =>
        runSQL(`SELECT 10000000000000000000::BIGINT AS BIGINT;`);
      assertThrows(test, Error, "Conversion Error");
    });
  });
});
