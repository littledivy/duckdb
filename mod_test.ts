import { assertObjectMatch } from "std/assert/mod.ts";

import { open } from "./mod.ts";

Deno.test("BigInt issue in query statement", () => {
  const db = open(":memory:");
  const connection = db.connect();
  assertObjectMatch(
    connection.query("SELECT 1234 AS result")[0],
    { result: 1234 },
  );
  connection.close();
  db.close();
});

Deno.test("BigInt issue in prepare statement", () => {
  const db = open(":memory:");
  const connection = db.connect();

  const prepared = connection.prepare(
    "select ?::INTEGER as number, ?::VARCHAR as text",
  );

  assertObjectMatch(
    prepared.query(1337, "foo")[0],
    { number: 1337, text: "foo" },
  );

  assertObjectMatch(
    prepared.query(null, "bar")[0],
    { number: 0, text: "bar" },
  );

  connection.close();
  db.close();
});
