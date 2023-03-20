import { expectType } from "tsd";
import { safely } from "./safely";
import type { Enum } from "../enum";
import type { Result } from "../result";

describe("safely", () => {
	it("should handle value", () => {
		const result = safely(() => "foo");
		expectType<Result<Enum.Generic<string>, unknown>>(result);
		expect(result).toMatchObject({ Ok: { value: "foo" } });
	});

	it("should handle thrown error", () => {
		const result = safely(() => {
			throw new TypeError("bar");
		});
		expectType<Result<Enum.Generic<never>, unknown>>(result);
		expect(result).toMatchObject({ Err: { value: { message: "bar" } } });
	});

	it("should handle promise value", async () => {
		const result = await safely(() => (async () => "foo")());
		expectType<Result<Enum.Generic<string>, unknown>>(result);
		expect(result).toMatchObject({
			Ok: { value: "foo" },
		});
	});

	it("should handle promise value", async () => {
		const result = await safely(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		expectType<Result<Enum.Generic<never>, unknown>>(result);
		expect(result).toMatchObject({ Err: { value: { message: "bar" } } });
	});
});