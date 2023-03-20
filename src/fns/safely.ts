import type { Enum } from "../enum";
import type { Result } from "../result";

export function safely<T>(
	fn: () => T
): T extends Promise<unknown>
	? Promise<Result<Enum.Generic<Awaited<T>>, unknown>>
	: Result<Enum.Generic<Awaited<T>>> {
	try {
		const value = fn();
		if (value && typeof value === "object" && "then" in value) {
			return (
				// @ts-expect-error Lazy.
				value
					.then((value: unknown) => ({ Ok: { value } }))
					.catch((value: unknown) => ({ Err: { value } }))
			);
		}
		// @ts-expect-error Lazy.
		return { Ok: { value } };
	} catch (error) {
		// @ts-expect-error Lazy.
		return { Err: { value: error } };
	}
}